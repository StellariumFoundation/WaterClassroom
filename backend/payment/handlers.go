package payment

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/water-classroom/backend/config" // Required for webhook secret
	// "github.com/water-classroom/backend/models" // If you need user model for UserID
)

// PaymentHandlers handles HTTP requests for payments.
type PaymentHandlers struct {
	service *PaymentService
	logger  *zap.Logger
	cfg     *config.Config // To access Stripe webhook secret
}

// NewPaymentHandlers creates new payment handlers.
func NewPaymentHandlers(service *PaymentService, logger *zap.Logger, cfg *config.Config) *PaymentHandlers {
	return &PaymentHandlers{
		service: service,
		logger:  logger,
		cfg:     cfg,
	}
}

// CreatePaymentIntentHandler handles requests to create a new payment intent.
func (h *PaymentHandlers) CreatePaymentIntentHandler(c *gin.Context) {
	var input CreatePaymentIntentInput // Using the type from service.go

	if err := c.ShouldBindJSON(&input); err != nil {
		h.logger.Error("Failed to bind JSON for CreatePaymentIntent", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	// TODO: Get UserID from context (set by auth middleware) and add to input if needed.
	// Example:
	// userID, exists := c.Get("userID")
	// if !exists {
	// 	 h.logger.Error("UserID not found in context")
	// 	 c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
	// 	 return
	// }
	// input.UserID = userID.(string) // Or however your UserID is stored

	// For now, assuming StripeCustomerID is passed directly or handled by service if not present
	// Ensure OrderID is also part of the input from the client or generated here.

	paymentIntent, err := h.service.CreatePaymentIntent(input)
	if err != nil {
		h.logger.Error("Failed to create PaymentIntent", zap.Error(err), zap.Any("input", input))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create PaymentIntent: " + err.Error()})
		return
	}

	h.logger.Info("PaymentIntent created successfully", zap.String("payment_intent_id", paymentIntent.ID), zap.String("client_secret", paymentIntent.ClientSecret))
	c.JSON(http.StatusOK, gin.H{
		"client_secret": paymentIntent.ClientSecret,
		"payment_intent_id": paymentIntent.ID,
	})
}

// StripeWebhookHandler handles incoming webhooks from Stripe.
func (h *PaymentHandlers) StripeWebhookHandler(c *gin.Context) {
	const MaxBodyBytes = int64(65536) // 64KB
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxBodyBytes)

	body, err := ReadRequestBody(c.Request) // Using helper from service.go
	if err != nil {
		h.logger.Error("Failed to read webhook request body", zap.Error(err))
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to read request body"})
		return
	}

	signatureHeader := c.GetHeader(stripeSignatureHeader) // Using const from service.go

	// The webhook secret should come from your configuration
	webhookSecret := h.cfg.Stripe.WebhookSecret
	if webhookSecret == "" {
		h.logger.Error("Stripe webhook secret is not configured")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Webhook secret not configured"})
		return
	}

	if err := h.service.HandleWebhook(body, signatureHeader, webhookSecret); err != nil {
		h.logger.Error("Error handling Stripe webhook", zap.Error(err), zap.String("signature", signatureHeader))
		// Determine status code based on error type if possible
		// For signature verification errors, Stripe expects a 400
		if _, ok := err.(interface{ SignatureMismatch() bool }); ok { // This is a hypothetical check, actual error type might differ
			c.JSON(http.StatusBadRequest, gin.H{"error": "Webhook signature verification failed"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Webhook handler error: " + err.Error()})
		}
		return
	}

	h.logger.Info("Stripe webhook processed successfully")
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}
