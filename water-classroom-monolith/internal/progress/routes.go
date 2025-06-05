package progress

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up the progress-related routes.
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *ProgressHandler, authMiddleware gin.HandlerFunc) {
	progressRoutes := apiGroup.Group("/progress")
	progressRoutes.Use(authMiddleware) // All progress routes require authentication
	{
		// Get progress for the current user (can be filtered by query params like ?itemId=X&itemType=lesson)
		progressRoutes.GET("", handler.HandleGetUserProgress)
		// Update progress for an item (e.g., lesson completed, quiz submitted)
		progressRoutes.POST("", handler.HandleUpdateUserProgressEvent) // Or PUT
	}

	handler.App.Logger.Info("Progress routes registered under /api/v1/progress")
}
