package main

import (
	"context"
	"crypto/rsa"
	"crypto/x509"
	"database/sql"
	"encoding/pem"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"github.com/rabbitmq/amqp091-go"
	"encoding/json"
	"io"
	"net/url"

	"github.com/google/uuid"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// GoogleUserInfo defines the structure for user information from Google
type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// RegisterRequest defines the structure for the registration request body
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// UserResponse defines the structure for the user data returned in responses
type UserResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	// Password hash should not be included
}

// LoginRequest defines the structure for the login request body
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse defines the structure for the login response body
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// OnboardingDetailsRequest defines the structure for updating user onboarding details
type OnboardingDetailsRequest struct {
	UserType      string `json:"user_type" binding:"required"` // e.g., "homeschool", "school_student", "individual"
	ClassroomCode string `json:"classroom_code"`             // Optional
}

// CurrentUserResponse defines the structure for the /user/me endpoint
type CurrentUserResponse struct {
	ID                 string         `json:"id"`
	DisplayName        string         `json:"display_name"`
	Email              string         `json:"email"`
	AvatarURL          sql.NullString `json:"avatar_url"`
	Role                 string         `json:"role"`
	IsVerified           bool           `json:"is_verified"`
	UserType             sql.NullString `json:"user_type"`
	ClassroomCode        sql.NullString `json:"classroom_code"`
	OnboardingComplete   bool           `json:"onboarding_complete"`
	SelectedCurriculumID sql.NullString `json:"selected_curriculum_id"` // New field
}

// UpdateCurriculumRequest defines the structure for updating selected curriculum
type UpdateCurriculumRequest struct {
	SelectedCurriculumID string `json:"selected_curriculum_id" binding:"required"`
}

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
}

// Application holds all dependencies
type Application struct {
	Config     *Config
	Logger     *zap.Logger
	DB         *sql.DB
	Redis      *redis.Client
	RabbitMQ   *amqp091.Connection
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
	Router     *gin.Engine
	GRPCServer *grpc.Server
	googleOAuthConfig *oauth2.Config
}

func main() {
	// Initialize context that can be canceled
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Load configuration
	config, err := loadConfig()
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	logger, err := initLogger(config.LogLevel, config.Env)
	if err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer logger.Sync()

	// Set Gin mode based on environment
	if config.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize application with dependencies
	app := &Application{
		Config: config,
		Logger: logger,
	}

	// Initialize Google OAuth config
	// Ensure OAuthGoogleClientID, OAuthGoogleClientSecret, OAuthGoogleRedirectURL are set in config
	if config.OAuthGoogleClientID != "" && config.OAuthGoogleClientSecret != "" && config.OAuthGoogleRedirectURL != "" {
		app.googleOAuthConfig = &oauth2.Config{
			ClientID:     config.OAuthGoogleClientID,
			ClientSecret: config.OAuthGoogleClientSecret,
			RedirectURL:  config.OAuthGoogleRedirectURL,
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
			Endpoint:     google.Endpoint,
		}
		logger.Info("Google OAuth configured")
	} else {
		logger.Warn("Google OAuth credentials not fully configured. Google OAuth will not be available.")
	}

	// Initialize database connection
	if err := app.initDatabase(); err != nil {
		logger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer app.DB.Close()

	// Initialize Redis connection
	if err := app.initRedis(ctx); err != nil {
		logger.Fatal("Failed to initialize Redis", zap.Error(err))
	}
	defer app.Redis.Close()

	// Initialize RabbitMQ connection
	if err := app.initRabbitMQ(); err != nil {
		logger.Fatal("Failed to initialize RabbitMQ", zap.Error(err))
	}
	defer app.RabbitMQ.Close()

	// Parse JWT keys
	if err := app.parseJWTKeys(); err != nil {
		logger.Fatal("Failed to parse JWT keys", zap.Error(err))
	}

	// Initialize HTTP router
	app.initRouter()

	// Initialize gRPC server
	app.initGRPCServer()

	// Start servers in a goroutine group
	g, gCtx := errgroup.WithContext(ctx)

	// Start HTTP server
	g.Go(func() error {
		return app.startHTTPServer(gCtx)
	})

	// Start gRPC server
	g.Go(func() error {
		return app.startGRPCServer(gCtx)
	})

	// Handle graceful shutdown
	g.Go(func() error {
		signalChan := make(chan os.Signal, 1)
		signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

		select {
		case sig := <-signalChan:
			logger.Info("Received shutdown signal", zap.String("signal", sig.String()))
			cancel() // Cancel the context to trigger shutdown
		case <-gCtx.Done():
			// Context was canceled elsewhere
		}
		return nil
	})

	// Wait for all goroutines to complete
	if err := g.Wait(); err != nil {
		logger.Error("Error during shutdown", zap.Error(err))
		os.Exit(1)
	}

	logger.Info("Service shutdown complete")
}

// loadConfig loads configuration from environment variables and config file
func loadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("../configs")
	viper.AddConfigPath("../../configs")

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
	viper.SetDefault("EMAIL_VERIFICATION_REQUIRED", true)
	viper.SetDefault("EMAIL_VERIFICATION_TOKEN_EXPIRY", "24h")
	viper.SetDefault("PASSWORD_RESET_TOKEN_EXPIRY", "1h")
	viper.SetDefault("DISABLE_AUTH", false)

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

// initLogger initializes the zap logger
func initLogger(level, env string) (*zap.Logger, error) {
	var config zap.Config

	if env == "production" {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
	}

	// Set log level
	switch strings.ToLower(level) {
	case "debug":
		config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	case "info":
		config.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	case "warn":
		config.Level = zap.NewAtomicLevelAt(zap.WarnLevel)
	case "error":
		config.Level = zap.NewAtomicLevelAt(zap.ErrorLevel)
	default:
		config.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	}

	return config.Build()
}

// initDatabase initializes the database connection
func (app *Application) initDatabase() error {
	db, err := sql.Open("postgres", app.Config.PostgresURI)
	if err != nil {
		return fmt.Errorf("error opening database connection: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(app.Config.PostgresMaxOpenConns)
	db.SetMaxIdleConns(app.Config.PostgresMaxIdleConns)
	db.SetConnMaxLifetime(app.Config.PostgresConnMaxLifetime)

	// Test connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("error connecting to database: %w", err)
	}

	app.DB = db
	app.Logger.Info("Database connection established")
	return nil
}

// initRedis initializes the Redis connection
func (app *Application) initRedis(ctx context.Context) error {
	rdb := redis.NewClient(&redis.Options{
		Addr:     app.Config.RedisAddr,
		Password: app.Config.RedisPassword,
		DB:       app.Config.RedisDB,
		PoolSize: app.Config.RedisPoolSize,
	})

	// Test connection
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		return fmt.Errorf("error connecting to Redis: %w", err)
	}

	app.Redis = rdb
	app.Logger.Info("Redis connection established")
	return nil
}

// initRabbitMQ initializes the RabbitMQ connection
func (app *Application) initRabbitMQ() error {
	if app.Config.RabbitMQURI == "" {
		app.Logger.Warn("RabbitMQ URI not provided, skipping connection")
		return nil
	}

	conn, err := amqp091.Dial(app.Config.RabbitMQURI)
	if err != nil {
		return fmt.Errorf("error connecting to RabbitMQ: %w", err)
	}

	app.RabbitMQ = conn
	app.Logger.Info("RabbitMQ connection established")
	return nil
}

// parseJWTKeys parses the RSA keys for JWT
func (app *Application) parseJWTKeys() error {
	// Parse private key
	privateKeyPEM := strings.ReplaceAll(app.Config.JWTPrivateKey, "\\n", "\n")
	privateKeyBlock, _ := pem.Decode([]byte(privateKeyPEM))
	if privateKeyBlock == nil {
		return fmt.Errorf("failed to parse PEM block containing private key")
	}

	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
	if err != nil {
		return fmt.Errorf("error parsing private key: %w", err)
	}
	app.PrivateKey = privateKey

	// Parse public key
	publicKeyPEM := strings.ReplaceAll(app.Config.JWTPublicKey, "\\n", "\n")
	publicKeyBlock, _ := pem.Decode([]byte(publicKeyPEM))
	if publicKeyBlock == nil {
		return fmt.Errorf("failed to parse PEM block containing public key")
	}

	publicKeyInterface, err := x509.ParsePKIXPublicKey(publicKeyBlock.Bytes)
	if err != nil {
		return fmt.Errorf("error parsing public key: %w", err)
	}

	publicKey, ok := publicKeyInterface.(*rsa.PublicKey)
	if !ok {
		return fmt.Errorf("not an RSA public key")
	}
	app.PublicKey = publicKey

	app.Logger.Info("JWT keys parsed successfully")
	return nil
}

// initRouter initializes the HTTP router with routes and middleware
func (app *Application) initRouter() {
	router := gin.New()

	// Middleware
	router.Use(gin.Recovery())
	
	// Logger middleware
	router.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		
		c.Next()
		
		end := time.Now()
		latency := end.Sub(start)
		
		app.Logger.Info("HTTP Request",
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("latency", latency),
			zap.String("client-ip", c.ClientIP()),
		)
	})

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     app.Config.CORSAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Authentication routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", app.handleRegister)
			auth.POST("/login", app.handleLogin)
			auth.POST("/refresh", app.handleRefreshToken)
			auth.POST("/forgot-password", app.handleForgotPassword)
			auth.POST("/reset-password", app.handleResetPassword)
			auth.POST("/verify-email", app.handleVerifyEmail)
			
			// OAuth routes
			auth.GET("/oauth/google", app.handleGoogleOAuth)
			auth.GET("/callback/google", app.handleGoogleCallback)
			auth.GET("/oauth/apple", app.handleAppleOAuth)
			auth.GET("/callback/apple", app.handleAppleCallback)
		}

		// Protected routes
		protected := v1.Group("/user")
		protected.Use(app.authMiddleware())
		{
			protected.GET("/me", app.handleGetCurrentUser)
			protected.PUT("/me", app.handleUpdateCurrentUser)
			protected.POST("/change-password", app.handleChangePassword)
			protected.DELETE("/me", app.handleDeleteAccount)
			protected.PUT("/onboarding-details", app.handleUpdateOnboardingDetails)
			protected.PUT("/curriculum", app.handleUpdateUserCurriculum) // New route for curriculum update
		}
	}

	app.Router = router
	app.Logger.Info("HTTP router initialized")
}

// initGRPCServer initializes the gRPC server
func (app *Application) initGRPCServer() {
	// Create a new gRPC server with the specified maximum message size
	opts := []grpc.ServerOption{
		grpc.MaxRecvMsgSize(app.Config.GRPCMaxMessageSize),
		grpc.MaxSendMsgSize(app.Config.GRPCMaxMessageSize),
	}
	server := grpc.NewServer(opts...)

	// Register gRPC services
	// authpb.RegisterAuthServiceServer(server, app.authGRPCService)

	// Enable reflection for development tools
	if app.Config.Env != "production" {
		reflection.Register(server)
	}

	app.GRPCServer = server
	app.Logger.Info("gRPC server initialized")
}

// startHTTPServer starts the HTTP server
func (app *Application) startHTTPServer(ctx context.Context) error {
	addr := fmt.Sprintf("%s:%d", app.Config.ServerHost, app.Config.ServerPort)
	server := &http.Server{
		Addr:    addr,
		Handler: app.Router,
	}

	// Channel to signal server has stopped
	serverClosed := make(chan struct{})

	// Start server in a goroutine
	go func() {
		app.Logger.Info("Starting HTTP server", zap.String("address", addr))

		var err error
		if app.Config.TLSCertFile != "" && app.Config.TLSKeyFile != "" {
			err = server.ListenAndServeTLS(app.Config.TLSCertFile, app.Config.TLSKeyFile)
		} else {
			err = server.ListenAndServe()
		}

		if err != nil && err != http.ErrServerClosed {
			app.Logger.Error("HTTP server error", zap.Error(err))
		}
		close(serverClosed)
	}()

	// Wait for context cancellation (shutdown signal)
	select {
	case <-ctx.Done():
		app.Logger.Info("Shutting down HTTP server")
		
		// Create a timeout context for shutdown
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		
		if err := server.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("HTTP server shutdown error: %w", err)
		}
		
		// Wait for server to finish processing requests
		<-serverClosed
		app.Logger.Info("HTTP server stopped")
		return nil
		
	case <-serverClosed:
		return fmt.Errorf("HTTP server stopped unexpectedly")
	}
}

// startGRPCServer starts the gRPC server
func (app *Application) startGRPCServer(ctx context.Context) error {
	addr := fmt.Sprintf("%s:%d", app.Config.ServerHost, app.Config.GRPCPort)
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("failed to listen on %s: %w", addr, err)
	}

	// Channel to signal server has stopped
	serverClosed := make(chan struct{})

	// Start server in a goroutine
	go func() {
		app.Logger.Info("Starting gRPC server", zap.String("address", addr))
		
		if err := app.GRPCServer.Serve(listener); err != nil {
			app.Logger.Error("gRPC server error", zap.Error(err))
		}
		
		close(serverClosed)
	}()

	// Wait for context cancellation (shutdown signal)
	select {
	case <-ctx.Done():
		app.Logger.Info("Shutting down gRPC server")
		app.GRPCServer.GracefulStop()
		
		// Wait for server to finish processing requests
		<-serverClosed
		app.Logger.Info("gRPC server stopped")
		return nil
		
	case <-serverClosed:
		return fmt.Errorf("gRPC server stopped unexpectedly")
	}
}

// Handler placeholder functions
func (app *Application) handleRegister(c *gin.Context) {
	var req RegisterRequest

	// Bind request body to struct
	if err := c.ShouldBindJSON(&req); err != nil {
		app.Logger.Error("Failed to bind request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// Check if user already exists
	var existingUserID string
	err := app.DB.QueryRowContext(c.Request.Context(), "SELECT id FROM users WHERE email = $1", req.Email).Scan(&existingUserID)
	if err != nil && err != sql.ErrNoRows {
		app.Logger.Error("Database error while checking for existing user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if err == nil { // User found
		app.Logger.Warn("Registration attempt with existing email", zap.String("email", req.Email))
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with this email already exists"})
		return
	}
	// If err is sql.ErrNoRows, then user does not exist, proceed.

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), app.Config.PasswordHashCost)
	if err != nil {
		app.Logger.Error("Failed to hash password", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing password"})
		return
	}

	// Insert new user into the database
	var newUserID string
	// Assuming 'users' table has id (UUID), display_name, email, password_hash
	// and returns the id of the newly inserted row.
	// The actual schema uses 'display_name' for the user's name.
	insertQuery := "INSERT INTO users (display_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id"
	err = app.DB.QueryRowContext(c.Request.Context(), insertQuery, req.Name, req.Email, string(hashedPassword)).Scan(&newUserID)
	if err != nil {
		app.Logger.Error("Failed to insert new user into database", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Return 201 Created with new user's details (excluding password)
	userResponse := UserResponse{
		ID:    newUserID,
		Name:  req.Name,
		Email: req.Email,
	}
	app.Logger.Info("User registered successfully", zap.String("userID", newUserID), zap.String("email", req.Email))
	c.JSON(http.StatusCreated, userResponse)
}

func (app *Application) handleLogin(c *gin.Context) {
	var req LoginRequest

	// Bind request body to struct
	if err := c.ShouldBindJSON(&req); err != nil {
		app.Logger.Error("Failed to bind request for login", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// Query database for user by email
	var userID, userEmail, passwordHash string
	// Assuming 'users' table has id, email, password_hash.
	// We also fetch display_name to potentially use it later, though not strictly needed for login logic itself.
	query := "SELECT id, email, password_hash FROM users WHERE email = $1"
	err := app.DB.QueryRowContext(c.Request.Context(), query, req.Email).Scan(&userID, &userEmail, &passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			app.Logger.Warn("Login attempt for non-existent email", zap.String("email", req.Email))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"}) // Generic error for non-existent user or bad password
			return
		}
		app.Logger.Error("Database error during login", zap.Error(err), zap.String("email", req.Email))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Compare provided password with stored hash
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
	if err != nil {
		// This includes bcrypt.ErrMismatchedHashAndPassword
		app.Logger.Warn("Invalid password attempt", zap.String("email", userEmail), zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"}) // Generic error
		return
	}

	signedAccessToken, signedRefreshToken, err := app.generateTokens(userID, userEmail)
	if err != nil {
		app.Logger.Error("Failed to generate tokens", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	app.Logger.Info("User logged in successfully", zap.String("userID", userID), zap.String("email", userEmail))

	// Return tokens
	loginResponse := LoginResponse{
		AccessToken:  signedAccessToken,
		RefreshToken: signedRefreshToken,
	}
	c.JSON(http.StatusOK, loginResponse)
}


// generateTokens is a helper function to create access and refresh JWTs
func (app *Application) generateTokens(userID, email string) (string, string, error) {
	// Generate Access Token
	accessTokenClaims := jwt.MapClaims{
		"sub":   userID,
		"aud":   app.Config.JWTAudience,
		"iss":   app.Config.JWTIssuer,
		"exp":   time.Now().Add(app.Config.JWTAccessTokenExpiry).Unix(),
		"email": email, // Optionally include email or other non-sensitive info
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodRS256, accessTokenClaims)
	signedAccessToken, err := accessToken.SignedString(app.PrivateKey)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}

	// Generate Refresh Token
	refreshTokenClaims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(app.Config.JWTRefreshTokenExpiry).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodRS256, refreshTokenClaims)
	signedRefreshToken, err := refreshToken.SignedString(app.PrivateKey)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return signedAccessToken, signedRefreshToken, nil
}


func (app *Application) handleRefreshToken(c *gin.Context) {
	// TODO: Implement token refresh logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleForgotPassword(c *gin.Context) {
	// TODO: Implement forgot password logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleResetPassword(c *gin.Context) {
	// TODO: Implement reset password logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleVerifyEmail(c *gin.Context) {
	// TODO: Implement email verification logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleGoogleOAuth(c *gin.Context) {
	if app.googleOAuthConfig == nil {
		app.Logger.Error("Google OAuth not configured")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Google OAuth not configured"})
		return
	}

	state := uuid.NewString()
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "oauthstate",
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HttpOnly: true,
		Secure:   app.Config.Env == "production", // Use secure cookies in production
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	})

	url := app.googleOAuthConfig.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (app *Application) handleGoogleCallback(c *gin.Context) {
	if app.googleOAuthConfig == nil {
		app.Logger.Error("Google OAuth not configured during callback")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Google OAuth not configured"})
		return
	}

	// 1. State validation
	oauthStateCookie, err := c.Cookie("oauthstate")
	if err != nil {
		app.Logger.Error("OAuth state cookie not found", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state: cookie not found"})
		return
	}
	// Clear cookie immediately after reading
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "oauthstate",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour), // Expire immediately
		HttpOnly: true,
		Secure:   app.Config.Env == "production",
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
	})

	if c.Query("state") != oauthStateCookie {
		app.Logger.Error("Invalid OAuth state", zap.String("query_state", c.Query("state")), zap.String("cookie_state", oauthStateCookie))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state value."})
		return
	}

	// 2. Code exchange
	code := c.Query("code")
	if code == "" {
		app.Logger.Error("OAuth code not found in query")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found."})
		return
	}

	token, err := app.googleOAuthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		app.Logger.Error("Failed to exchange OAuth code for token", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange code for token."})
		return
	}

	// 3. Fetch user info from Google
	client := app.googleOAuthConfig.Client(c.Request.Context(), token)
	userInfoResp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		app.Logger.Error("Failed to get user info from Google", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info from Google."})
		return
	}
	defer userInfoResp.Body.Close()

	userInfoBody, err := io.ReadAll(userInfoResp.Body)
	if err != nil {
		app.Logger.Error("Failed to read user info response body", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read user info."})
		return
	}

	var googleUser GoogleUserInfo
	if err := json.Unmarshal(userInfoBody, &googleUser); err != nil {
		app.Logger.Error("Failed to unmarshal Google user info", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info."})
		return
	}

	if googleUser.Email == "" {
		app.Logger.Error("Google user info does not contain an email")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email not provided by Google."})
		return
	}


	// 4. Database interaction (Upsert user)
	var userID string
	var userEmail string // Store email from DB for logging/token generation

	// Try to find user by google_id
	err = app.DB.QueryRowContext(c.Request.Context(),
		"SELECT id, email FROM users WHERE google_id = $1", googleUser.ID).Scan(&userID, &userEmail)

	if err == sql.ErrNoRows { // No user with this google_id, try by email
		app.Logger.Info("No user found with google_id, trying email", zap.String("google_id", googleUser.ID), zap.String("email", googleUser.Email))
		var existingGoogleID sql.NullString // To check if email is already linked to another google_id

		err = app.DB.QueryRowContext(c.Request.Context(),
			"SELECT id, email, google_id FROM users WHERE email = $1", googleUser.Email).Scan(&userID, &userEmail, &existingGoogleID)

		if err == sql.ErrNoRows { // No user with this email either, create new user
			app.Logger.Info("No user found with email, creating new user", zap.String("email", googleUser.Email))
			insertQuery := `
				INSERT INTO users (email, display_name, avatar_url, google_id)
				VALUES ($1, $2, $3, $4)
				RETURNING id, email`
			err = app.DB.QueryRowContext(c.Request.Context(), insertQuery,
				googleUser.Email, googleUser.Name, googleUser.Picture, googleUser.ID).Scan(&userID, &userEmail)
			if err != nil {
				app.Logger.Error("Failed to insert new Google user", zap.Error(err))
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user."})
				return
			}
			app.Logger.Info("New user created via Google OAuth", zap.String("userID", userID), zap.String("email", userEmail))
		} else if err != nil { // Other DB error
			app.Logger.Error("Database error when checking user by email for Google OAuth", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
			return
		} else { // User found by email
			if existingGoogleID.Valid && existingGoogleID.String != googleUser.ID {
				// Email exists and is linked to a DIFFERENT Google ID
				app.Logger.Error("Email associated with a different Google account",
					zap.String("email", googleUser.Email),
					zap.String("current_google_id", existingGoogleID.String),
					zap.String("new_google_id", googleUser.ID))
				c.JSON(http.StatusConflict, gin.H{"error": "This email is already linked to a different Google account."})
				return
			}
			// Link Google ID to existing email account or update info
			app.Logger.Info("Linking Google ID to existing user by email", zap.String("userID", userID), zap.String("email", userEmail))
			updateQuery := `
				UPDATE users SET google_id = $1, display_name = $2, avatar_url = $3, updated_at = NOW()
				WHERE id = $4 RETURNING email` // make sure display_name and avatar_url are updated
			_, err = app.DB.ExecContext(c.Request.Context(), updateQuery, googleUser.ID, googleUser.Name, googleUser.Picture, userID)
			if err != nil {
				app.Logger.Error("Failed to link Google ID to existing user", zap.Error(err))
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user."})
				return
			}
			// userEmail is already set from the SELECT query
		}
	} else if err != nil { // Other DB error when checking by google_id
		app.Logger.Error("Database error when checking user by google_id", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
		return
	} else { // User found by google_id, update their info if necessary
		app.Logger.Info("User found by google_id, updating info if changed", zap.String("userID", userID), zap.String("email", userEmail))
		updateQuery := `
			UPDATE users SET email = $1, display_name = $2, avatar_url = $3, updated_at = NOW()
			WHERE id = $4 RETURNING email`
		err = app.DB.QueryRowContext(c.Request.Context(), updateQuery,
			googleUser.Email, googleUser.Name, googleUser.Picture, userID).Scan(&userEmail)
		if err != nil {
			app.Logger.Error("Failed to update existing Google user's info", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user info."})
			return
		}
	}

	// 5. Generate JWTs
	signedAccessToken, signedRefreshToken, err := app.generateTokens(userID, userEmail)
	if err != nil {
		app.Logger.Error("Failed to generate tokens for Google OAuth user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens."})
		return
	}

	app.Logger.Info("User authenticated via Google OAuth successfully", zap.String("userID", userID), zap.String("email", userEmail))

	// 6. Redirect to frontend
	// The frontend URL should be configurable. For now, hardcoding a common pattern.
	// TODO: Make this redirect URL configurable, e.g., app.Config.FrontendOAuthCallbackURL
	redirectTargetURL := "http://localhost:5173/auth/oauth-callback"

	// Add tokens as query parameters
	parsedURL, err := url.Parse(redirectTargetURL)
	if err != nil {
		app.Logger.Error("Failed to parse frontend redirect URL", zap.Error(err), zap.String("url", redirectTargetURL))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error during redirect setup."})
		return
	}
	query := parsedURL.Query()
	query.Set("access_token", signedAccessToken)
	query.Set("refresh_token", signedRefreshToken)
	parsedURL.RawQuery = query.Encode()

	c.Redirect(http.StatusTemporaryRedirect, parsedURL.String())
}


func (app *Application) handleAppleOAuth(c *gin.Context) {
	// TODO: Implement Apple OAuth logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleAppleCallback(c *gin.Context) {
	// TODO: Implement Apple OAuth callback logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleGetCurrentUser(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		app.Logger.Error("User ID not found in token for /me endpoint")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		app.Logger.Error("Invalid User ID format in token for /me endpoint", zap.Any("userID", userIDAny))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	query := `
		SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id
		FROM users
		WHERE id = $1`

	var user CurrentUserResponse
	err := app.DB.QueryRowContext(c.Request.Context(), query, userIDStr).Scan(
		&user.ID,
		&user.DisplayName,
		&user.Email,
		&user.AvatarURL,
		&user.Role,
		&user.IsVerified,
		&user.UserType,
		&user.ClassroomCode,
		&user.OnboardingComplete,
		&user.SelectedCurriculumID, // Added scanning for the new field
	)

	if err != nil {
		if err == sql.ErrNoRows {
			app.Logger.Warn("User not found by ID from token", zap.String("userID", userIDStr))
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		app.Logger.Error("Database error when fetching current user", zap.Error(err), zap.String("userID", userIDStr))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user details"})
		return
	}

	app.Logger.Info("Successfully fetched current user details", zap.String("userID", userIDStr))
	c.JSON(http.StatusOK, user)
}

func (app *Application) handleUpdateCurrentUser(c *gin.Context) {
	// TODO: Implement update current user logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleChangePassword(c *gin.Context) {
	// TODO: Implement change password logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

func (app *Application) handleDeleteAccount(c *gin.Context) {
	// TODO: Implement delete account logic
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

// handleUpdateOnboardingDetails updates the user's onboarding information
func (app *Application) handleUpdateOnboardingDetails(c *gin.Context) {
	var req OnboardingDetailsRequest

	userID, exists := c.Get("userId")
	if !exists {
		app.Logger.Error("User ID not found in token during onboarding update")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		app.Logger.Error("Invalid User ID format in token during onboarding update", zap.Any("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		app.Logger.Error("Failed to bind onboarding details request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	// Basic validation for user_type (could be expanded)
	if req.UserType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User type is required"})
		return
	}
	// Example validation:
	// allowedUserTypes := map[string]bool{"homeschool": true, "school_student": true, "individual": true}
	// if !allowedUserTypes[req.UserType] {
	//    c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type specified"})
	//    return
	// }


	// Handle optional classroom_code: pass NULL to db if empty string
	var classroomCodeArg interface{}
	if req.ClassroomCode == "" {
		classroomCodeArg = nil // This will be converted to NULL by the database driver for VARCHAR
	} else {
		classroomCodeArg = req.ClassroomCode
	}

	updateQuery := `
		UPDATE users
		SET user_type = $1, classroom_code = $2, onboarding_complete = TRUE, updated_at = NOW()
		WHERE id = $3`

	result, err := app.DB.ExecContext(c.Request.Context(), updateQuery, req.UserType, classroomCodeArg, userIDStr)
	if err != nil {
		app.Logger.Error("Failed to update user onboarding details in database", zap.Error(err), zap.String("userID", userIDStr))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update onboarding details"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		app.Logger.Error("Failed to get rows affected after onboarding update", zap.Error(err), zap.String("userID", userIDStr))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error confirming update"})
		return
	}

	if rowsAffected == 0 {
		// This case should ideally not happen if authMiddleware correctly validates user existence via token.
		// However, it's good practice to check.
		app.Logger.Warn("No user found to update onboarding details for", zap.String("userID", userIDStr))
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	app.Logger.Info("User onboarding details updated successfully", zap.String("userID", userIDStr), zap.String("userType", req.UserType))
	c.JSON(http.StatusOK, gin.H{"message": "Onboarding details updated successfully"})
}

// handleUpdateUserCurriculum updates the user's selected curriculum ID
func (app *Application) handleUpdateUserCurriculum(c *gin.Context) {
	var req UpdateCurriculumRequest

	userID, exists := c.Get("userId")
	if !exists {
		app.Logger.Error("User ID not found in token during curriculum update")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		app.Logger.Error("Invalid User ID format in token during curriculum update", zap.Any("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		app.Logger.Error("Failed to bind update curriculum request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	if req.SelectedCurriculumID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Selected curriculum ID is required"})
		return
	}

	updateQuery := `
		UPDATE users
		SET selected_curriculum_id = $1, updated_at = NOW()
		WHERE id = $2`

	result, err := app.DB.ExecContext(c.Request.Context(), updateQuery, req.SelectedCurriculumID, userIDStr)
	if err != nil {
		app.Logger.Error("Failed to update user curriculum ID in database", zap.Error(err), zap.String("userID", userIDStr))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update curriculum selection"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		app.Logger.Error("Failed to get rows affected after curriculum update", zap.Error(err), zap.String("userID", userIDStr))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error confirming update for curriculum selection"})
		return
	}

	if rowsAffected == 0 {
		app.Logger.Warn("No user found to update curriculum for", zap.String("userID", userIDStr))
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	app.Logger.Info("User curriculum updated successfully", zap.String("userID", userIDStr), zap.String("curriculumID", req.SelectedCurriculumID))
	c.JSON(http.StatusOK, gin.H{"message": "User curriculum updated successfully"})
}


// authMiddleware returns a Gin middleware for JWT authentication
func (app *Application) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if app.Config.DisableAuth {
			app.Logger.Warn("Authentication is disabled, skipping token validation")
			c.Next()
			return
		}

		// Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		// Check the format of the header
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		// Parse and validate the token
		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the alg is what we expect
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return app.PublicKey, nil
		})

		if err != nil {
			app.Logger.Error("Token validation error", zap.Error(err))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		if !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Extract claims and set in context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// Store user ID in context for handlers to use
			if userId, ok := claims["sub"].(string); ok {
				c.Set("userId", userId)
			}
		}

		c.Next()
	}
}
