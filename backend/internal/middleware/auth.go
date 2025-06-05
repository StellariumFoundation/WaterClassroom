package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/StellariumFoundation/WaterClassroom/backend/internal/app" // Adjusted
	"go.uber.org/zap"                                                 // Ensure zap is imported
)

// AuthMiddleware returns a Gin middleware for JWT authentication
func AuthMiddleware(application *app.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		if application.Config.DisableAuth {
			application.Logger.Warn("Authentication is disabled, skipping token validation")
			// Optionally set a default user ID for development if auth is disabled
			// c.Set("userId", "dev-user-id")
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			application.Logger.Warn("Authorization header is missing")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			application.Logger.Warn("Authorization header format is invalid", zap.String("header", authHeader))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			if application.PublicKey == nil {
				application.Logger.Error("Public key for JWT validation is nil")
				return nil, fmt.Errorf("public key not available")
			}
			return application.PublicKey, nil
		})

		if err != nil {
			application.Logger.Warn("Token validation error", zap.Error(err))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		if !token.Valid {
			application.Logger.Warn("Token is invalid", zap.String("token", tokenString))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if userId, ok := claims["sub"].(string); ok && userId != "" {
				c.Set("userId", userId)
				application.Logger.Debug("User authenticated", zap.String("userId", userId))
			} else {
				application.Logger.Warn("User ID (sub) not found or empty in token claims", zap.Any("claims", claims))
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims: User ID missing"})
				return
			}
		} else {
			application.Logger.Error("Failed to parse token claims", zap.Any("claims_type", fmt.Sprintf("%T", token.Claims)))
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims: Unable to parse"})
			return
		}

		c.Next()
	}
}
