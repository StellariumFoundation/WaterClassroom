package notification

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/water-classroom/water-classroom-monolith/internal/app"
	"go.uber.org/zap"
)

// NotificationHandler holds dependencies for notification routes
type NotificationHandler struct {
	App *app.Application
	// Service *NotificationService // To be added later
}

// NewNotificationHandler creates a new NotificationHandler
func NewNotificationHandler(application *app.Application /*, service *NotificationService*/) *NotificationHandler {
	return &NotificationHandler{
		App: application,
		// Service: service,
	}
}

// HandleGetUserNotifications example placeholder handler to get user's notifications
func (h *NotificationHandler) HandleGetUserNotifications(c *gin.Context) {
	userID, _ := c.Get("userId") // Assuming userId is set by auth middleware
	h.App.Logger.Info("HandleGetUserNotifications called", zap.Any("user_id", userID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "user_id": userID})
}

// HandleMarkNotificationAsRead example placeholder handler
func (h *NotificationHandler) HandleMarkNotificationAsRead(c *gin.Context) {
	notificationID := c.Param("id")
	userID, _ := c.Get("userId")
	h.App.Logger.Info("HandleMarkNotificationAsRead called",
		zap.Any("user_id", userID),
		zap.String("notification_id", notificationID),
		zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "notification_id": notificationID})
}
