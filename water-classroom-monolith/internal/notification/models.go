package notification

// Models for notifications will be defined here.
// e.g., Notification, UserNotificationPreference, etc.
// For now, this is a placeholder.

// ExampleNotification represents a basic notification structure.
type ExampleNotification struct {
	ID      string `json:"id"`
	UserID  string `json:"user_id"` // The user to whom the notification is directed
	Type    string `json:"type"`    // e.g., "new_grade", "event_reminder", "system_update"
	Message string `json:"message"`
	IsRead  bool   `json:"is_read"`
}
