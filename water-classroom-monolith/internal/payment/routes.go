package payment

import (
	"github.com/gin-gonic/gin"
	"github.com/water-classroom/water-classroom-monolith/internal/app"
	"go.uber.org/zap"
)

// RegisterRoutes sets up the payment-related routes for the monolith.
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *PaymentHandler, authMiddleware gin.HandlerFunc) {
	paymentRoutes := apiGroup.Group("/payments") // Base path for payment related actions
	{
		// Create a payment intent - requires authentication
		paymentRoutes.POST("/intents", authMiddleware, handler.HandleCreatePaymentIntent)

		// Payment history - requires authentication
		paymentRoutes.GET("/history", authMiddleware, handler.HandleGetPaymentHistory)
	}

	// Stripe webhooks - public, as Stripe servers call this directly.
	// It's crucial that StripeWebhookHandler verifies the webhook signature.
	// The path can be something less guessable or configured.
	apiGroup.POST("/stripe-webhooks", handler.HandleStripeWebhook)

	handler.App.Logger.Info("Payment routes registered.",
		zap.String("payment_intent_route", apiGroup.BasePath()+"/payments/intents"),
		zap.String("payment_history_route", apiGroup.BasePath()+"/payments/history"),
		zap.String("stripe_webhook_route", apiGroup.BasePath()+"/stripe-webhooks"),
	)
}
