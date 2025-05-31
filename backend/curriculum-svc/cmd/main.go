package main

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Config holds all configuration for the application
type Config struct {
	Env                     string        `mapstructure:"ENV"`
	ServerHost              string        `mapstructure:"SERVER_HOST"`
	ServerPort              string        `mapstructure:"SERVER_PORT"`
	GRPCPort                string        `mapstructure:"GRPC_PORT"`
	LogLevel                string        `mapstructure:"LOG_LEVEL"`
	PostgresURI             string        `mapstructure:"POSTGRES_URI"`
	PostgresMaxOpenConns    int           `mapstructure:"POSTGRES_MAX_OPEN_CONNS"`
	PostgresMaxIdleConns    int           `mapstructure:"POSTGRES_MAX_IDLE_CONNS"`
	PostgresConnMaxLifetime time.Duration `mapstructure:"POSTGRES_CONN_MAX_LIFETIME"`
}

// Application holds application-wide dependencies
type Application struct {
	config Config
	logger *zap.Logger
	db     *sql.DB
}

func main() {
	cfg, err := loadConfig()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	logger, err := initLogger(cfg.LogLevel, cfg.Env)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer logger.Sync() // flushes buffer, if any

	logger.Info("Logger initialized successfully")

	db, err := initDatabase(cfg)
	if err != nil {
		logger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer db.Close()

	logger.Info("Database connection pool established successfully")

	app := &Application{
		config: cfg,
		logger: logger,
		db:     db,
	}

	app.logger.Info("Curriculum service starting...",
		zap.String("env", app.config.Env),
		zap.String("server_host", app.config.ServerHost),
		zap.String("server_port", app.config.ServerPort),
		zap.String("grpc_port", app.config.GRPCPort),
	)

	// Placeholder for starting server (HTTP/gRPC)
	// For now, we just log that the service has initialized
	app.logger.Info("Curriculum service initialized successfully. (No server started yet)")
}

// loadConfig reads configuration from file or environment variables.
func loadConfig() (Config, error) {
	var cfg Config

	viper.AddConfigPath("./configs") // Path to look for the config file in
	viper.SetConfigName("config")   // Name of config file (without extension)
	viper.SetConfigType("yaml")     // REQUIRED if the config file does not have the extension in the name

	viper.AutomaticEnv() // Read in environment variables that match

	// Set default values
	viper.SetDefault("ENV", "development")
	viper.SetDefault("SERVER_HOST", "0.0.0.0")
	viper.SetDefault("SERVER_PORT", "8082")
	viper.SetDefault("GRPC_PORT", "50053")
	viper.SetDefault("LOG_LEVEL", "info")
	viper.SetDefault("POSTGRES_MAX_OPEN_CONNS", 10)
	viper.SetDefault("POSTGRES_MAX_IDLE_CONNS", 10)
	viper.SetDefault("POSTGRES_CONN_MAX_LIFETIME", "5m")
	// It's better to not set a default for POSTGRES_URI to ensure it's explicitly configured.


	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if we have env variables
			fmt.Println("Config file not found, relying on environment variables and defaults.")
		} else {
			// Config file was found but another error was produced
			return cfg, fmt.Errorf("error reading config file: %w", err)
		}
	}

	// Unmarshal the config into the Config struct
	if err := viper.Unmarshal(&cfg); err != nil {
		return cfg, fmt.Errorf("unable to decode into struct: %w", err)
	}

	// Validate essential config
	if cfg.PostgresURI == "" {
		return cfg, fmt.Errorf("POSTGRES_URI must be set")
	}


	return cfg, nil
}

// initLogger sets up a new Zap logger.
func initLogger(level string, env string) (*zap.Logger, error) {
	logLevel := zapcore.InfoLevel
	if err := logLevel.Set(level); err != nil {
		return nil, fmt.Errorf("failed to set log level: %w", err)
	}

	var logger *zap.Logger
	var err error

	if env == "development" {
		config := zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		config.Level = zap.NewAtomicLevelAt(logLevel)
		logger, err = config.Build()
	} else {
		config := zap.NewProductionConfig()
		config.Level = zap.NewAtomicLevelAt(logLevel)
		logger, err = config.Build()
	}

	if err != nil {
		return nil, fmt.Errorf("failed to build logger: %w", err)
	}

	return logger, nil
}

// initDatabase establishes a new database connection pool.
func initDatabase(cfg Config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.PostgresURI)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	db.SetMaxOpenConns(cfg.PostgresMaxOpenConns)
	db.SetMaxIdleConns(cfg.PostgresMaxIdleConns)
	db.SetConnMaxLifetime(cfg.PostgresConnMaxLifetime)

	// Verify the connection with a ping.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		db.Close() // Close the connection if ping fails
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}
