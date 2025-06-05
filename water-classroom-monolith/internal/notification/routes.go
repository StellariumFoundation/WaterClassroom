package notification

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up the notification-related routes.
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *NotificationHandler, authMiddleware gin.HandlerFunc) {
	notificationRoutes := apiGroup.Group("/notifications")
	notificationRoutes.Use(authMiddleware) // All notification routes require authentication
	{
		// Get all notifications for the current user
		notificationRoutes.GET("", handler.HandleGetUserNotifications)
		// Mark a specific notification as read
		notificationRoutes.PATCH("/:id/read", handler.HandleMarkNotificationAsRead)
		// Could also have POST for creating a notification (admin/system use)
		// or settings for user notification preferences
		// e.g., notificationRoutes.GET("/preferences", handler.HandleGetUserPreferences)
		// e.g., notificationRoutes.PUT("/preferences", handler.HandleUpdateUserPreferences)
	}

	handler.App.Logger.Info("Notification routes registered under /api/v1/notifications")
}
