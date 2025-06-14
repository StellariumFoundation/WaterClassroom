// Package payment provides minimal stubs so that the monolith can compile and
// tests can run until the real payment service is implemented.
package payment

import (
	"github.com/gin-gonic/gin"
	"github.com/water-classroom/backend/app"
)

// StripeClient is a stub for the actual Stripe client.
type StripeClient struct{}

// NewStripeClient returns a new stub StripeClient.
// The real implementation would initialize a Stripe client with the secret key.
func NewStripeClient(application *app.Application, secretKey string) *StripeClient {
	// In a real implementation, you might use application.Logger or cfg from application.Config
	_ = application
	_ = secretKey
	application.Logger.Info("Payment Stub: NewStripeClient called (stub implementation)")
	return &StripeClient{}
}

// PaymentService is a stub for the payment service logic.
type PaymentService struct{}

// NewPaymentService returns a new stub PaymentService.
// The real implementation would handle database interactions and business logic for payments.
func NewPaymentService(application *app.Application) *PaymentService {
	_ = application
	application.Logger.Info("Payment Stub: NewPaymentService called (stub implementation)")
	return &PaymentService{}
}

// PaymentHandler is a stub for Gin request handlers related to payments.
type PaymentHandler struct{}

// NewPaymentHandler returns a new stub PaymentHandler.
// The real implementation would use the application, Stripe client, and payment service.
func NewPaymentHandler(application *app.Application, sc *StripeClient, ps *PaymentService) *PaymentHandler {
	_ = application
	_ = sc
	_ = ps
	application.Logger.Info("Payment Stub: NewPaymentHandler called (stub implementation)")
	return &PaymentHandler{}
}

// RegisterRoutes is a stub for registering payment-related API routes.
// The real implementation would define various endpoints for payment processing.
func RegisterRoutes(router *gin.RouterGroup, handler *PaymentHandler, authMiddleware gin.HandlerFunc) {
	// This is a stub, so no routes are actually registered.
	// Example of how routes might be grouped:
	// paymentRoutes := router.Group("/payments")
	// paymentRoutes.Use(authMiddleware)
	// {
	//  paymentRoutes.POST("/checkout", handler.HandleCreateCheckoutSession)
	//  paymentRoutes.POST("/webhook", handler.HandleStripeWebhook) // Webhook might not need authMw
	//  paymentRoutes.GET("/status/:session_id", handler.HandleGetPaymentStatus)
	// }
	_ = router
	_ = handler
	_ = authMiddleware
	// Log that stub is called if a logger is available, or print
	// For now, we assume this function itself doesn't have direct access to app.Logger
	// but the handlers it might call would.
}
