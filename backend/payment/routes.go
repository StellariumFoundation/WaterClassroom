package payment

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/water-classroom/backend/config"     // Added for cfg
	"github.com/water-classroom/backend/middleware" // Assuming you have auth middleware
)

// RegisterPaymentRoutes sets up the routes for payment operations.
// It requires an auth middleware to protect routes that need authentication.
func RegisterPaymentRoutes(router *gin.RouterGroup, service *PaymentService, logger *zap.Logger, cfg *config.Config, authMW *middleware.AuthMiddleware) {
	// Create a new group for payment routes, e.g., /api/v1/payments
	paymentRoutes := router.Group("/payments")
	paymentRoutes.Use(authMW.Authenticate()) // Protect routes that need it

	// Initialize handlers
	paymentHandlers := NewPaymentHandlers(service, logger, cfg) // Pass cfg

	// Define routes
	paymentRoutes.POST("/create-payment-intent", paymentHandlers.CreatePaymentIntentHandler)

	// Webhook route should typically not be behind auth middleware that requires user session,
	// as it's called by Stripe servers. It might have a different kind of verification (e.g. IP whitelist or just signature).
	// If it's part of the same group and authMW.Authenticate() is applied to all,
	// you might need a separate group or to exclude this route from user auth.
	// For simplicity here, we'll register it on a non-authenticated or differently authenticated path if needed,
	// or ensure the middleware can handle service-to-service calls if it's generic.
	// Let's assume for now it's okay or a separate webhook router group would be used in a real app.
	// We will register it directly on the main router if no specific sub-grouping for webhooks is needed.
	// Or, if the base 'router' passed to RegisterPaymentRoutes is already /api/v1, then this is fine.

	// Create a separate route for webhooks that does not use the standard user authentication middleware.
	// This is a common pattern as webhooks are called by an external service (Stripe).
	webhookRouter := router.Group("/payments") // Or a different base path if desired
	webhookRouter.POST("/webhook", paymentHandlers.StripeWebhookHandler)

	logger.Info("Payment routes registered")
}
