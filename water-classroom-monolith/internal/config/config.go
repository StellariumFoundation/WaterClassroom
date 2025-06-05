package config

import (
	"fmt"
	"strings"
	"time"

	"github.com/spf13/viper"
)

// Config holds all configuration for the service
type Config struct {
	Env                    string        `mapstructure:"ENV"`
	ServerHost             string        `mapstructure:"SERVER_HOST"`
	ServerPort             int           `mapstructure:"SERVER_PORT"`
	GRPCPort               int           `mapstructure:"GRPC_PORT"`
	GRPCMaxMessageSize     int           `mapstructure:"GRPC_MAX_MESSAGE_SIZE"`
	LogLevel               string        `mapstructure:"LOG_LEVEL"`
	PostgresURI            string        `mapstructure:"POSTGRES_URI"`
	PostgresMaxOpenConns   int           `mapstructure:"POSTGRES_MAX_OPEN_CONNS"`
	PostgresMaxIdleConns   int           `mapstructure:"POSTGRES_MAX_IDLE_CONNS"`
	PostgresConnMaxLifetime time.Duration `mapstructure:"POSTGRES_CONN_MAX_LIFETIME"`
	RedisAddr              string        `mapstructure:"REDIS_ADDR"`
	RedisPassword          string        `mapstructure:"REDIS_PASSWORD"`
	RedisDB                int           `mapstructure:"REDIS_DB"`
	RedisPoolSize          int           `mapstructure:"REDIS_POOL_SIZE"`
	JWTPrivateKey          string        `mapstructure:"JWT_PRIVATE_KEY"`
	JWTPublicKey           string        `mapstructure:"JWT_PUBLIC_KEY"`
	JWTAccessTokenExpiry   time.Duration `mapstructure:"JWT_ACCESS_TOKEN_EXPIRY"`
	JWTRefreshTokenExpiry  time.Duration `mapstructure:"JWT_REFRESH_TOKEN_EXPIRY"`
	JWTIssuer              string        `mapstructure:"JWT_ISSUER"`
	JWTAudience            string        `mapstructure:"JWT_AUDIENCE"`
	PasswordHashCost       int           `mapstructure:"PASSWORD_HASH_COST"`
	RateLimitRequests      int           `mapstructure:"RATE_LIMIT_REQUESTS"`
	RateLimitWindow        time.Duration `mapstructure:"RATE_LIMIT_WINDOW"`
	OAuthGoogleClientID    string        `mapstructure:"OAUTH_GOOGLE_CLIENT_ID"`
	OAuthGoogleClientSecret string        `mapstructure:"OAUTH_GOOGLE_CLIENT_SECRET"`
	OAuthGoogleRedirectURL string        `mapstructure:"OAUTH_GOOGLE_REDIRECT_URL"`
	FrontendOAuthCallbackURL string      `mapstructure:"FRONTEND_OAUTH_CALLBACK_URL"` // New field
	OAuthAppleClientID     string        `mapstructure:"OAUTH_APPLE_CLIENT_ID"`
	OAuthAppleClientSecret string        `mapstructure:"OAUTH_APPLE_CLIENT_SECRET"`
	OAuthAppleRedirectURL  string        `mapstructure:"OAUTH_APPLE_REDIRECT_URL"`
	RabbitMQURI            string        `mapstructure:"RABBITMQ_URI"`
	OTELExporterEndpoint   string        `mapstructure:"OTEL_EXPORTER_OTLP_ENDPOINT"`
	OTELServiceName        string        `mapstructure:"OTEL_SERVICE_NAME"`
	CORSAllowedOrigins     []string      `mapstructure:"CORS_ALLOWED_ORIGINS"`
	TLSCertFile            string        `mapstructure:"TLS_CERT_FILE"`
	TLSKeyFile             string        `mapstructure:"TLS_KEY_FILE"`
	EmailVerificationRequired bool        `mapstructure:"EMAIL_VERIFICATION_REQUIRED"`
	EmailVerificationTokenExpiry time.Duration `mapstructure:"EMAIL_VERIFICATION_TOKEN_EXPIRY"`
	PasswordResetTokenExpiry time.Duration `mapstructure:"PASSWORD_RESET_TOKEN_EXPIRY"`
	DisableAuth            bool          `mapstructure:"DISABLE_AUTH"`
	StripeSecretKey        string        `mapstructure:"STRIPE_SECRET_KEY"`
	StripeWebhookSecret    string        `mapstructure:"STRIPE_WEBHOOK_SECRET"`
}

// LoadConfig loads configuration from environment variables and config file
func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	// Adjusted path for monolith structure
	viper.AddConfigPath("./water-classroom-monolith/configs")
	viper.AddConfigPath("../configs") // For when running from cmd/server
	viper.AddConfigPath("./configs") // For when running from monolith root for example go run ./cmd/server

	// Set defaults
	viper.SetDefault("ENV", "development")
	viper.SetDefault("SERVER_HOST", "0.0.0.0")
	viper.SetDefault("SERVER_PORT", 8080)
	viper.SetDefault("GRPC_PORT", 50051)
	viper.SetDefault("GRPC_MAX_MESSAGE_SIZE", 4*1024*1024) // 4MB
	viper.SetDefault("LOG_LEVEL", "info")
	viper.SetDefault("POSTGRES_MAX_OPEN_CONNS", 25)
	viper.SetDefault("POSTGRES_MAX_IDLE_CONNS", 25)
	viper.SetDefault("POSTGRES_CONN_MAX_LIFETIME", "5m")
	viper.SetDefault("REDIS_DB", 0)
	viper.SetDefault("REDIS_POOL_SIZE", 10)
	viper.SetDefault("JWT_ACCESS_TOKEN_EXPIRY", "15m")
	viper.SetDefault("JWT_REFRESH_TOKEN_EXPIRY", "7d")
	viper.SetDefault("JWT_ISSUER", "water-classroom-auth")
	viper.SetDefault("JWT_AUDIENCE", "water-classroom-api")
	viper.SetDefault("PASSWORD_HASH_COST", 12)
	viper.SetDefault("RATE_LIMIT_REQUESTS", 100)
	viper.SetDefault("RATE_LIMIT_WINDOW", "1m")
	viper.SetDefault("CORS_ALLOWED_ORIGINS", []string{"http://localhost:5173", "http://localhost:3000"})
	viper.SetDefault("FRONTEND_OAUTH_CALLBACK_URL", "http://localhost:5173/auth/oauth-callback")
	viper.SetDefault("EMAIL_VERIFICATION_REQUIRED", true)
	viper.SetDefault("EMAIL_VERIFICATION_TOKEN_EXPIRY", "24h")
	viper.SetDefault("PASSWORD_RESET_TOKEN_EXPIRY", "1h")
	viper.SetDefault("DISABLE_AUTH", false)
	viper.SetDefault("STRIPE_SECRET_KEY", "")      // Default to empty, expect override from env
	viper.SetDefault("STRIPE_WEBHOOK_SECRET", "") // Default to empty, expect override from env


	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
		// Config file not found, will rely on environment variables
	}

	// Environment variables override config file
	viper.AutomaticEnv()

	// Parse the config into struct
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
	}

	// Parse CORS allowed origins
	if corsStr := viper.GetString("CORS_ALLOWED_ORIGINS"); corsStr != "" {
		config.CORSAllowedOrigins = strings.Split(corsStr, ",")
	}

	return &config, nil
}
