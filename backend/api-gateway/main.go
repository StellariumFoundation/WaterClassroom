package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	gin.SetMode(gin.ReleaseMode) // Set to release mode for production
	router := gin.New()          // Use gin.New() instead of gin.Default() for more control in prod
	router.Use(gin.Recovery())   // Add recovery middleware
	// Add Logger middleware if desired: router.Use(gin.Logger())
	// For production, structured logging might be preferred.

	staticFilesDir := "./static_frontend"

	// Serve static files using StaticFS.
	// This will serve files from 'staticFilesDir'.
	// E.g. request to /favicon.png will serve staticFilesDir/favicon.png
	// It also serves index.html for the root path "/" if it exists in staticFilesDir.
	router.StaticFS("/", http.Dir(staticFilesDir))

	// API routes placeholder
	api := router.Group("/api/v1")
	{
		authRoutes := api.Group("/auth")
		authRoutes.POST("/login", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "auth login placeholder"})
		})
		authRoutes.POST("/register", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "auth register placeholder"})
		})
		// TODO: Add routes for curriculum-svc, payment-svc etc.
		// These should be actual proxy handlers in a real setup.
	}

	// SPA Fallback: For any route not handled by StaticFS or API groups.
	router.NoRoute(func(c *gin.Context) {
		// Only serve index.html for GET requests that are not API calls
		// and do not seem like direct file asset requests (e.g. /some/image.png)
		if c.Request.Method == "GET" &&
			!strings.HasPrefix(c.Request.URL.Path, "/api/") &&
			filepath.Ext(c.Request.URL.Path) == "" { // Only if no file extension

			indexPath := filepath.Join(staticFilesDir, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				c.File(indexPath)
				return
			} else {
				log.Printf("SPA Fallback: index.html not found at %s: %v. Serving 404.", indexPath, err)
				c.String(http.StatusNotFound, "Page not found and index.html is missing.")
				return
			}
		}
		// For all other NoRoute cases (e.g. API path not found, non-GET asset-like request, path with extension not found by StaticFS)
		// Gin will implicitly return 404 if no response has been written.
	})

	log.Printf("API Gateway starting on port %s, serving static files from %s\n", port, staticFilesDir)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start API Gateway: %v", err)
	}
}
