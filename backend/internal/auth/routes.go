package auth

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up the auth and user-related routes
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *AuthHandler, authMiddleware gin.HandlerFunc) {
	authRoutes := apiGroup.Group("/auth")
	{
		authRoutes.POST("/register", handler.HandleRegister)
		authRoutes.POST("/login", handler.HandleLogin)
		authRoutes.POST("/refresh", handler.HandleRefreshToken)
		authRoutes.POST("/forgot-password", handler.HandleForgotPassword)
		authRoutes.POST("/reset-password", handler.HandleResetPassword)
		authRoutes.POST("/verify-email", handler.HandleVerifyEmail) // Assuming it's POST, adjust if GET with token in query

		// OAuth routes
		authRoutes.GET("/oauth/google", handler.HandleGoogleOAuth)
		authRoutes.GET("/callback/google", handler.HandleGoogleCallback)
		authRoutes.GET("/oauth/apple", handler.HandleAppleOAuth)       // Placeholder
		authRoutes.GET("/callback/apple", handler.HandleAppleCallback) // Placeholder
	}

	userProtected := apiGroup.Group("/user")
	userProtected.Use(authMiddleware)
	{
		userProtected.GET("/me", handler.HandleGetCurrentUser)
		userProtected.PUT("/me", handler.HandleUpdateCurrentUser)
		userProtected.POST("/change-password", handler.HandleChangePassword)
		userProtected.DELETE("/me", handler.HandleDeleteAccount)
		userProtected.PUT("/onboarding-details", handler.HandleUpdateOnboardingDetails)
		userProtected.PUT("/curriculum", handler.HandleUpdateUserCurriculum)
	}
}
