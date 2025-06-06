package payment

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/water-classroom/backend/app"
	"go.uber.org/zap"
	"github.com/google/uuid"
)

// PaymentHandler holds dependencies for payment routes
type PaymentHandler struct {
	App           *app.Application
	StripeService *StripeClient
	PaymentService *PaymentService // For DB operations
}

// NewPaymentHandler creates a new PaymentHandler
func NewPaymentHandler(application *app.Application, stripeClient *StripeClient, paymentService *PaymentService) *PaymentHandler {
	return &PaymentHandler{
		App:            application,
		StripeService:  stripeClient,
		PaymentService: paymentService,
	}
}

// HandleCreatePaymentIntent handles the creation of a Stripe Payment Intent
func (ph *PaymentHandler) HandleCreatePaymentIntent(c *gin.Context) {
	var req CreatePaymentIntentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ph.App.Logger.Error("Invalid JSON request for payment intent", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request: " + err.Error()})
		return
	}

	if req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid amount: must be greater than 0"})
		return
	}
	if req.Currency == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid currency: must not be empty"})
		return
	}

	userID, exists := c.Get("userId")
	if !exists {
		ph.App.Logger.Error("User ID not found in token for creating payment intent")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ph.App.Logger.Error("Invalid User ID format in token for creating payment intent")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format"})
		return
	}


	pi, err := ph.StripeService.CreatePaymentIntent(req.Amount, req.Currency)
	if err != nil {
		ph.App.Logger.Error("Error creating payment intent via StripeService", zap.Error(err))
		if stripeErr, ok := err.(*stripe.Error); ok {
			ph.App.Logger.Error("Stripe error details",
				zap.String("type", string(stripeErr.Type)),
				zap.String("code", string(stripeErr.Code)),
				zap.String("msg", stripeErr.Msg),
				zap.String("param", stripeErr.Param))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing payment with Stripe"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error while creating payment intent"})
		}
		return
	}

	// Create a preliminary payment record in the database
	paymentRecord := &Payment{
		ID:                    uuid.NewString(), // Generate new UUID for our DB record
		UserID:                userIDStr,
		StripePaymentIntentID: pi.ID,
		Amount:                pi.Amount,
		Currency:              string(pi.Currency),
		Status:                string(pi.Status), // e.g., "requires_payment_method"
		Description:           &req.Description,  // Save description from request
		CreatedAt:             time.Now(),
		UpdatedAt:             time.Now(),
	}

	if err := ph.PaymentService.CreatePaymentRecord(c.Request.Context(), paymentRecord); err != nil {
		ph.App.Logger.Error("Failed to save preliminary payment record", zap.Error(err), zap.String("stripe_pi_id", pi.ID))
		// Decide if this error should cause the entire operation to fail.
		// For now, log it but still return client_secret to allow payment attempt.
		// In a production system, this might need more robust error handling or rollback.
	} else {
		ph.App.Logger.Info("Preliminary payment record saved", zap.String("payment_id", paymentRecord.ID), zap.String("stripe_pi_id", pi.ID))
	}


	c.JSON(http.StatusOK, CreatePaymentIntentResponse{
		ClientSecret: pi.ClientSecret,
		PaymentID:    paymentRecord.ID,
		PaymentStatus: string(pi.Status),
	})
}

// HandleStripeWebhook handles incoming webhooks from Stripe
func (ph *PaymentHandler) HandleStripeWebhook(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		ph.App.Logger.Error("Error reading request body for webhook", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading request body"})
		return
	}
	defer c.Request.Body.Close()

	signatureHeader := c.Request.Header.Get("Stripe-Signature")
	if signatureHeader == "" {
		ph.App.Logger.Warn("Webhook error: Missing Stripe-Signature header")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing Stripe-Signature header"})
		return
	}

	webhookSecret := ph.App.Config.StripeWebhookSecret
	if webhookSecret == "" {
		ph.App.Logger.Error("Stripe webhook secret is not configured in the application")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Webhook processing misconfigured"})
		return
	}

	event, err := ph.StripeService.HandleWebhook(payload, signatureHeader, webhookSecret)
	if err != nil {
		ph.App.Logger.Error("Error handling webhook via StripeService", zap.Error(err))
		errMsgLower := strings.ToLower(err.Error()) // Check generic error string
		isSignatureError := false
		if stripeErr, ok := err.(*stripe.Error); ok {
			errMsgLower = strings.ToLower(stripeErr.Msg)
			if stripeErr.Type == stripe.ErrorTypeStripeSignatureVerification {
				isSignatureError = true
			}
		}

		if isSignatureError || strings.Contains(errMsgLower, "signature verification failed") || strings.Contains(errMsgLower, "no signature found") {
			ph.App.Logger.Warn("Webhook signature verification failed", zap.Error(err))
			c.JSON(http.StatusBadRequest, gin.H{"error": "Webhook signature verification failed"})
		} else {
			ph.App.Logger.Error("Error processing webhook", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing webhook"})
		}
		return
	}

	// If HandleWebhook in StripeClient is updated to call PaymentService methods,
	// those methods will handle DB updates.
	// For now, we confirm the event was processed by StripeClient.
	if event != nil {
		ph.App.Logger.Info("Stripe webhook event processed by StripeClient", zap.String("event_id", event.ID), zap.String("event_type", string(event.Type)))

		// Example of how you might extract data and update DB via PaymentService
		var paymentIntent stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err == nil && paymentIntent.ID != "" {
			err := ph.PaymentService.UpdatePaymentStatusByIntentID(c.Request.Context(), paymentIntent.ID, string(paymentIntent.Status))
			if err != nil {
				ph.App.Logger.Error("Failed to update payment status from webhook",
					zap.String("payment_intent_id", paymentIntent.ID),
					zap.String("new_status", string(paymentIntent.Status)),
					zap.Error(err),
				)
				// Don't necessarily return error to Stripe if our internal processing fails,
				// Stripe only cares that we acknowledged the event. We should retry/log internally.
			} else {
				ph.App.Logger.Info("Payment status updated from webhook",
					zap.String("payment_intent_id", paymentIntent.ID),
					zap.String("new_status", string(paymentIntent.Status)),
				)
			}
		} else if err != nil {
             ph.App.Logger.Warn("Could not unmarshal event data to PaymentIntent for DB update", zap.String("event_type", string(event.Type)), zap.Error(err))
        }
	}


	c.JSON(http.StatusOK, gin.H{"status": "webhook processed"})
}

// HandleGetPaymentHistory handles requests for user's payment history
func (ph *PaymentHandler) HandleGetPaymentHistory(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		ph.App.Logger.Error("User ID not found in token for payment history")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ph.App.Logger.Error("Invalid User ID format in token for payment history")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format"})
		return
	}

	payments, err := ph.PaymentService.GetPaymentsByUserID(c.Request.Context(), userIDStr)
	if err != nil {
		ph.App.Logger.Error("Failed to retrieve payment history for user", zap.String("user_id", userIDStr), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payment history"})
		return
	}

	historyItems := make([]PaymentHistoryItem, 0, len(payments))
	for _, p := range payments {
		historyItems = append(historyItems, PaymentHistoryItem{
			PaymentID:   p.ID,
			Date:        p.CreatedAt,
			Amount:      p.Amount,
			Currency:    p.Currency,
			Status:      p.Status,
			Description: p.Description,
		})
	}

	ph.App.Logger.Info("Payment history retrieved for user", zap.String("user_id", userIDStr), zap.Int("count", len(historyItems)))
	c.JSON(http.StatusOK, PaymentHistoryResponse{History: historyItems})
}

// Helper to get context with timeout for DB calls if needed
func getDBRequestContext(c *gin.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(c.Request.Context(), 5*time.Second) // Example timeout
}
