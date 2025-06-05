package router

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/water-classroom/water-classroom-monolith/internal/app" // Adjusted import path
	"go.uber.org/zap"
	"path/filepath" // Added
	"strings"       // Added
)

// NewRouter initializes a new Gin router with middleware
func NewRouter(application *app.Application) *gin.Engine {
	router := gin.New()

	// Middleware
	router.Use(gin.Recovery())

	// Logger middleware
	router.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery

		c.Next()

		end := time.Now()
		latency := end.Sub(start)

		fields := []zap.Field{
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("latency", latency),
			zap.String("client-ip", c.ClientIP()),
		}
		if rawQuery != "" {
			fields = append(fields, zap.String("query", rawQuery))
		}
		if c.Errors != nil && len(c.Errors.Errors()) > 0 {
			fields = append(fields, zap.Strings("gin-errors", c.Errors.Errors()))
		}


		application.Logger.Info("HTTP Request", fields...)
	})

	// CORS middleware
	if application.Config.CORSAllowedOrigins != nil && len(application.Config.CORSAllowedOrigins) > 0 {
		router.Use(cors.New(cors.Config{
			AllowOrigins:     application.Config.CORSAllowedOrigins,
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
		application.Logger.Info("CORS middleware enabled", zap.Strings("allowed_origins", application.Config.CORSAllowedOrigins))
	} else {
		application.Logger.Info("CORS middleware not configured or no origins specified.")
	}


	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	application.Logger.Info("HTTP router initialized with base middleware and health check.")

	// Static file serving for SPA
	// Ensure this is defined after API routes if there's any overlap,
	// though typically API routes are prefixed (e.g., /api/v1)
	staticFilesDir := "./static_frontend" // Relative to where the binary is run

	// Serve static files from the root path.
	// Gin's StaticFS will serve index.html for "/" if present.
	// It handles existing files like /assets/main.css correctly.
	router.StaticFS("/", http.Dir(staticFilesDir))

	// SPA Fallback: For any route not handled by StaticFS or API groups.
	// This ensures that client-side routing works for GET requests.
	router.NoRoute(func(c *gin.Context) {
		// Only serve index.html for GET requests that are not API calls
		// and do not seem like direct file asset requests (e.g., /some/image.png with an extension).
		// API calls are typically handled by their specific groups.
		// The check for "/api/" might be redundant if API routes are registered before NoRoute.
		if c.Request.Method == "GET" &&
			!strings.HasPrefix(c.Request.URL.Path, "/api/") &&
			filepath.Ext(c.Request.URL.Path) == "" { // Only if no file extension

			indexPath := filepath.Join(staticFilesDir, "index.html")
			// Check if index.html exists. Stat is a common way.
			// Using http.Dir's Open method can also work, but Stat is often clearer for existence checks.
			// For Gin, directly serving the file is often enough, and it handles non-existence with a 404.
			// However, an explicit check allows for custom logging or behavior.

			// Simplest way with Gin: just serve the file. Gin handles 404 if not found.
			// c.File(indexPath)
			// return

			// More robust check (similar to original api-gateway):
			if _, err := http.Dir(staticFilesDir).Open("index.html"); err == nil {
				c.File(indexPath) // Serve the main SPA page
				return
			} else {
				application.Logger.Error("SPA Fallback: index.html not found",
					zap.String("path", indexPath),
					zap.Error(err),
				)
				// Fall through to Gin's default 404 or a custom one if defined elsewhere
				// For clarity, explicitly return a 404 if index.html is crucial and missing.
				c.String(http.StatusNotFound, "SPA entry point (index.html) not found.")
				return
			}
		}
		// For all other NoRoute cases (e.g., API path not found, non-GET asset-like request,
		// path with extension not found by StaticFS), Gin will implicitly return 404
		// if no response has been written by a prior NoRoute handler.
		// If you have multiple NoRoute handlers, ensure they c.Next() if not handling the request.
	})

	application.Logger.Info("Static file serving and SPA fallback configured.", zap.String("static_dir", staticFilesDir))

	return router
}
