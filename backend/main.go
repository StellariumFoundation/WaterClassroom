package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/rabbitmq/amqp091-go"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/sync/errgroup"

	"github.com/water-classroom/backend/app"
	"github.com/water-classroom/backend/auth"
	"github.com/water-classroom/backend/config"
	"github.com/water-classroom/backend/database"
	"github.com/water-classroom/backend/middleware"
	"github.com/water-classroom/backend/router"
	"github.com/water-classroom/backend/payment"          // <- stubbed payment package
	"github.com/water-classroom/backend/assessment"        // Added
	"github.com/water-classroom/backend/curriculum"
	"github.com/water-classroom/backend/notification"     // Adde
	"github.com/water-classroom/backend/progress"         // Added
	"github.com/water-classroom/backend/tutor_orchestrator" // Added
	"github.com/water-classroom/backend/pkg/logger"
	"go.uber.org/zap"
	// _ "google.golang.org/grpc/reflection" // Keep for later if gRPC is fully integrated
	// "google.golang.org/grpc" // Keep for later
)

func main() {
	// Initialize context that can be canceled
	rootCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize logger
	appLogger, err := logger.InitLogger(cfg.LogLevel, cfg.Env)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer appLogger.Sync()

	appLogger.Info("Monolith starting...")
	appLogger.Info("Configuration loaded successfully")
	appLogger.Info("Logger initialized successfully")

	// Set Gin mode
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Initialize Application Struct
	application := &app.Application{
		Config: cfg,
		Logger: appLogger,
	}

	// Initialize database connection
	db, err := database.InitDB(cfg, appLogger)
	if err != nil {
		appLogger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer db.Close()
	application.DB = db
	appLogger.Info("Database connection initialized successfully")

	// Initialize Redis (adapt initRedis from auth-svc)
	if err := initRedis(rootCtx, application); err != nil {
		appLogger.Fatal("Failed to initialize Redis", zap.Error(err))
	}
	if application.Redis != nil {
		defer application.Redis.Close()
		appLogger.Info("Redis connection initialized successfully")
	}

	// Initialize RabbitMQ (adapt initRabbitMQ from auth-svc)
	if err := initRabbitMQ(application); err != nil {
		// Log as fatal only if RabbitMQ is essential for startup
		appLogger.Error("Failed to initialize RabbitMQ", zap.Error(err))
	}
	if application.RabbitMQ != nil {
		defer application.RabbitMQ.Close()
		appLogger.Info("RabbitMQ connection initialized successfully")
	}

	// Parse JWT keys
	if err := auth.ParseJWTKeys(application); err != nil {
		appLogger.Fatal("Failed to parse JWT keys", zap.Error(err))
	}

	// Initialize Google OAuth config
	if cfg.OAuthGoogleClientID != "" && cfg.OAuthGoogleClientSecret != "" && cfg.OAuthGoogleRedirectURL != "" {
		application.GoogleOAuthConfig = &oauth2.Config{
			ClientID:     cfg.OAuthGoogleClientID,
			ClientSecret: cfg.OAuthGoogleClientSecret,
			RedirectURL:  cfg.OAuthGoogleRedirectURL, // This should be the monolith's callback
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
			Endpoint:     google.Endpoint,
		}
		appLogger.Info("Google OAuth configured")
	} else {
		appLogger.Warn("Google OAuth credentials not fully configured. Google OAuth will not be available.")
	}

	// Initialize HTTP router
	engine := router.NewRouter(application)
	application.Router = engine // Store it in the app struct if needed by other components like startHTTPServer

	// Initialize AuthHandler
	authHandler := &auth.AuthHandler{App: application}

	// Get Auth Middleware
	authMw := middleware.AuthMiddleware(application)

	// Register API v1 routes
	apiV1 := engine.Group("/api/v1")
	auth.RegisterRoutes(apiV1, authHandler, authMw)
	appLogger.Info("Auth routes registered under /api/v1")

	// Initialize CurriculumHandler and Register Curriculum Routes
	curriculumHandler := &curriculum.CurriculumHandler{App: application}
	curriculum.RegisterRoutes(apiV1, curriculumHandler, authMw)
	appLogger.Info("Curriculum routes registered under /api/v1")

	// Initialize StripeClient, PaymentService, PaymentHandler and Register Payment Routes
	if cfg.StripeSecretKey == "" {
		appLogger.Warn("Stripe secret key not configured. Payment functionality will be limited/disabled.")
		// Decide if this is fatal. For now, we'll let it run but Stripe dependent endpoints will fail.
	}
	stripeClient := payment.NewStripeClient(application, cfg.StripeSecretKey)

	paymentSvc := payment.NewPaymentService(application) // For DB interactions by handlers/stripeclient

	paymentHandler := payment.NewPaymentHandler(application, stripeClient, paymentSvc)
	payment.RegisterRoutes(apiV1, paymentHandler, authMw)
	appLogger.Info("Payment routes registered under /api/v1")

	// Initialize AssessmentHandler, Service and Register Routes
	assessmentSvc := assessment.NewAssessmentService(application)
	_ = assessmentSvc // Placeholder until used
	assessmentHandler := assessment.NewAssessmentHandler(application /*, assessmentSvc */)
	assessment.RegisterRoutes(apiV1, assessmentHandler, authMw)
	appLogger.Info("Assessment routes registered under /api/v1")

	// Initialize NotificationHandler, Service and Register Routes
	notificationSvc := notification.NewNotificationService(application)
	_ = notificationSvc // Placeholder until used
	notificationHandler := notification.NewNotificationHandler(application /*, notificationSvc */)
	notification.RegisterRoutes(apiV1, notificationHandler, authMw)
	appLogger.Info("Notification routes registered under /api/v1")

	// Initialize ProgressHandler, Service and Register Routes
	progressSvc := progress.NewProgressService(application)
	_ = progressSvc // Placeholder until used
	progressHandler := progress.NewProgressHandler(application /*, progressSvc */)
	progress.RegisterRoutes(apiV1, progressHandler, authMw)
	appLogger.Info("Progress routes registered under /api/v1")

	// Initialize TutorOrchestratorHandler, Service and Register Routes
	tutorOrchestratorSvc := tutor_orchestrator.NewTutorOrchestratorService(application)
	_ = tutorOrchestratorSvc // Placeholder until used
	tutorOrchestratorHandler := tutor_orchestrator.NewTutorOrchestratorHandler(application /*, tutorOrchestratorSvc */)
	tutor_orchestrator.RegisterRoutes(apiV1, tutorOrchestratorHandler, authMw)
	appLogger.Info("Tutor Orchestrator routes registered under /api/v1")

	appLogger.Info("All API version 1 routes registered", zap.String("group", "/api/v1"))


	// Start servers in a goroutine group for graceful shutdown
	g, gCtx := errgroup.WithContext(rootCtx)

	// Start HTTP server
	g.Go(func() error {
		return startHTTPServer(gCtx, application)
	})

	// Start gRPC server (placeholder for now)
	g.Go(func() error {
		// return startGRPCServer(gCtx, application)
		appLogger.Info("gRPC server initialization skipped for now.")
		<-gCtx.Done() // Keep alive until context is cancelled
		return nil
	})

	// Handle graceful shutdown signals
	g.Go(func() error {
		signalChan := make(chan os.Signal, 1)
		signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
		select {
		case sig := <-signalChan:
			appLogger.Info("Received shutdown signal", zap.String("signal", sig.String()))
			cancel() // Cancel the main context to trigger shutdown for all goroutines
		case <-gCtx.Done():
			// Context was canceled elsewhere (e.g. one of the servers failed)
		}
		return nil
	})

	appLogger.Info("Monolith setup complete. Starting servers...")
	// Wait for all goroutines in the group to complete
	if err := g.Wait(); err != nil {
		// Don't log fatal if it's due to context cancellation (expected on shutdown)
		if err != context.Canceled && err != http.ErrServerClosed {
			appLogger.Fatal("Error group encountered an error", zap.Error(err))
		} else {
			appLogger.Info("Error group completed due to context cancellation or server closed.", zap.Error(err))
		}
	}

	appLogger.Info("Service shutdown complete.")
}

// initRedis initializes the Redis connection and stores it in the Application struct
func initRedis(ctx context.Context, app *app.Application) error {
	if app.Config.RedisAddr == "" {
		app.Logger.Warn("Redis address not provided, skipping Redis initialization.")
		return nil
	}
	rdb := redis.NewClient(&redis.Options{
		Addr:     app.Config.RedisAddr,
		Password: app.Config.RedisPassword,
		DB:       app.Config.RedisDB,
		PoolSize: app.Config.RedisPoolSize,
	})
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		return fmt.Errorf("error connecting to Redis: %w", err)
	}
	app.Redis = rdb
	return nil
}

// initRabbitMQ initializes the RabbitMQ connection and stores it in the Application struct
func initRabbitMQ(app *app.Application) error {
	if app.Config.RabbitMQURI == "" {
		app.Logger.Warn("RabbitMQ URI not provided, skipping RabbitMQ initialization.")
		return nil
	}
	conn, err := amqp091.Dial(app.Config.RabbitMQURI)
	if err != nil {
		return fmt.Errorf("error connecting to RabbitMQ: %w", err)
	}
	app.RabbitMQ = conn
	return nil
}

// startHTTPServer starts the HTTP server
func startHTTPServer(ctx context.Context, app *app.Application) error {
	addr := fmt.Sprintf("%s:%d", app.Config.ServerHost, app.Config.ServerPort)
	server := &http.Server{
		Addr:    addr,
		Handler: app.Router, // Use the router from the app struct
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout: 15 * time.Second,
	}

	serverClosed := make(chan struct{})
	go func() {
		app.Logger.Info("Starting HTTP server", zap.String("address", addr))
		var err error
		if app.Config.TLSCertFile != "" && app.Config.TLSKeyFile != "" {
			app.Logger.Info("TLS enabled for HTTP server.")
			err = server.ListenAndServeTLS(app.Config.TLSCertFile, app.Config.TLSKeyFile)
		} else {
			app.Logger.Info("TLS not configured for HTTP server.")
			err = server.ListenAndServe()
		}
		if err != nil && err != http.ErrServerClosed {
			app.Logger.Error("HTTP server error", zap.Error(err))
		}
		close(serverClosed)
	}()

	select {
	case <-ctx.Done(): // Context was canceled (e.g. shutdown signal)
		app.Logger.Info("Shutting down HTTP server...")
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			app.Logger.Error("HTTP server shutdown error", zap.Error(err))
			return fmt.Errorf("HTTP server shutdown error: %w", err)
		}
		<-serverClosed // Wait for the ListenAndServe goroutine to exit
		app.Logger.Info("HTTP server stopped.")
		return nil
	case <-serverClosed: // Server stopped unexpectedly
		app.Logger.Error("HTTP server stopped unexpectedly.")
		// This will cause the error group to cancel other goroutines if this was not intentional.
		return fmt.Errorf("HTTP server stopped unexpectedly")
	}
}

// startGRPCServer (placeholder)
func startGRPCServer(ctx context.Context, app *app.Application) error {
	if app.Config.GRPCPort == 0 { // Assuming GRPCPort = 0 means disabled
		app.Logger.Info("gRPC server port not configured, gRPC server will not start.")
		<-ctx.Done() // Keep the goroutine alive until context is cancelled
		return nil
	}

	addr := fmt.Sprintf("%s:%d", app.Config.ServerHost, app.Config.GRPCPort)
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("failed to listen on gRPC addr %s: %w", addr, err)
	}
	// placeholder to silence unused variable lint/compile error while
	// gRPC server is not yet implemented.
	_ = listener

	// This is where you would initialize your gRPC server:
	// grpcServer := grpc.NewServer(...)
	// yourpb.RegisterYourServiceServer(grpcServer, yourServiceImpl)
	// app.GRPCServer = grpcServer // Store it in app if needed

	app.Logger.Info("gRPC server (placeholder) checking config.", zap.String("address", addr), zap.Int("port", app.Config.GRPCPort))
	// listener is declared but not used in this simplified placeholder.
	// In a real implementation, app.GRPCServer would be initialized and started here.
	// For this placeholder, we just block until context is done.
	app.Logger.Info("gRPC server not fully implemented. Skipping actual server start. Waiting for context cancellation.")
	<-ctx.Done() // Block until context is cancelled
	app.Logger.Info("gRPC server (placeholder) context cancelled, routine ending.")
	return nil
}
