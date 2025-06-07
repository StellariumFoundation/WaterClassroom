package payment

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/client"
	"github.com/stripe/stripe-go/v82/webhook"
	"go.uber.org/zap"

	"github.com/water-classroom/backend/config"
	"github.com/water-classroom/backend/database"
)

// PaymentService handles payment-related operations.
type PaymentService struct {
	db     *database.DB
	stripe *client.API
	logger *zap.Logger
}

// NewPaymentService creates a new PaymentService.
func NewPaymentService(cfg *config.Config, db *database.DB, logger *zap.Logger) (*PaymentService, error) {
	sc := &client.API{}
	sc.Init(cfg.Stripe.SecretKey, nil)

	// Verify Stripe client initialization (optional, but recommended)
	// This can be done by making a simple API call, e.g., listing account balance.
	// For brevity, we'll skip this here.
	log.Println("Stripe client initialized successfully")

	return &PaymentService{
		db:     db,
		stripe: sc,
		logger: logger,
	}, nil
}

// CreateCustomerInput defines the input for creating a customer.
type CreateCustomerInput struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

// CreateCustomer creates a new Stripe customer and updates the user record.
func (s *PaymentService) CreateCustomer(input CreateCustomerInput) (*stripe.Customer, error) {
	params := &stripe.CustomerParams{
		Email: stripe.String(input.Email),
		Name:  stripe.String(input.Name),
		Metadata: map[string]string{
			"user_id": input.UserID,
		},
	}

	customer, err := s.stripe.Customers.New(params)
	if err != nil {
		s.logger.Error("Failed to create Stripe customer", zap.Error(err), zap.String("user_id", input.UserID))
		return nil, err
	}

	s.logger.Info("Stripe customer created successfully", zap.String("stripe_customer_id", customer.ID), zap.String("user_id", input.UserID))

	// Update the users table with the Stripe customer ID
	_, err = s.db.Exec("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", customer.ID, input.UserID)
	if err != nil {
		// TODO: Handle potential rollback or compensation if Stripe customer was created but DB update failed.
		// For now, we log the error. In a production system, you might want to delete the Stripe customer
		// or have a retry mechanism for the DB update.
		s.logger.Error("Failed to update user with Stripe customer ID", zap.Error(err), zap.String("user_id", input.UserID), zap.String("stripe_customer_id", customer.ID))
		return nil, err // Or return the customer and a specific error indicating DB update failure
	}

	s.logger.Info("User record updated with Stripe customer ID", zap.String("user_id", input.UserID), zap.String("stripe_customer_id", customer.ID))
	return customer, nil
}

// CreatePaymentIntentInput defines the input for creating a PaymentIntent.
type CreatePaymentIntentInput struct {
	Amount        int64  `json:"amount"` // Amount in cents
	Currency      string `json:"currency"`
	StripeCustomerID string `json:"stripe_customer_id"` // Optional: associate with a customer
	Description   string `json:"description"`        // Optional
	OrderID       string `json:"order_id"`           // To associate with an order in our system
}

// CreatePaymentIntent creates a new Stripe PaymentIntent.
func (s *PaymentService) CreatePaymentIntent(input CreatePaymentIntentInput) (*stripe.PaymentIntent, error) {
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(input.Amount),
		Currency: stripe.String(input.Currency),
		Customer: stripe.String(input.StripeCustomerID), // Can be empty if not provided
		// PaymentMethodTypes: stripe.StringSlice([]string{"card"}), // Example, can be configured
		Description: stripe.String(input.Description),
		Metadata: map[string]string{
			"order_id": input.OrderID, // Store our internal order_id
		},
	}

	pi, err := s.stripe.PaymentIntents.New(params)
	if err != nil {
		s.logger.Error("Failed to create Stripe PaymentIntent",
			zap.Error(err),
			zap.Int64("amount", input.Amount),
			zap.String("currency", input.Currency),
			zap.String("order_id", input.OrderID))
		return nil, err
	}

	s.logger.Info("Stripe PaymentIntent created successfully",
		zap.String("payment_intent_id", pi.ID),
		zap.String("order_id", input.OrderID))

	// Optionally, store the payment intent ID and status in your 'payments' table here.
	// This depends on whether you want to record the intent before it's confirmed or only after success/failure via webhooks.
	// For this example, we'll assume webhooks will handle the main status updates.

	return pi, nil
}

const (
	stripeSignatureHeader = "Stripe-Signature"
)

// HandleWebhook processes incoming Stripe webhooks.
// It requires the raw request body and the Stripe-Signature header.
func (s *PaymentService) HandleWebhook(body []byte, signatureHeader string, webhookSecret string) error {
	// 1. Verify the webhook signature
	event, err := webhook.ConstructEvent(body, signatureHeader, webhookSecret)
	if err != nil {
		s.logger.Error("Failed to verify Stripe webhook signature", zap.Error(err))
		// Return an error that can be translated into a 400 Bad Request
		return fmt.Errorf("webhook signature verification failed: %w", err)
	}

	s.logger.Info("Stripe webhook event received", zap.String("event_id", event.ID), zap.String("event_type", event.Type))

	// 2. Handle the event based on its type
	switch event.Type {
	case "payment_intent.succeeded":
		var paymentIntent stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err != nil {
			s.logger.Error("Error parsing webhook PII data for payment_intent.succeeded", zap.Error(err), zap.String("event_id", event.ID))
			return fmt.Errorf("error parsing payment_intent.succeeded: %w", err)
		}
		s.logger.Info("PaymentIntent succeeded",
			zap.String("payment_intent_id", paymentIntent.ID),
			zap.String("order_id", paymentIntent.Metadata["order_id"]), // Assuming order_id is in metadata
		)

		// TODO: Update payment status in 'payments' table to 'succeeded'
		// Example:
		// _, dbErr := s.db.Exec("UPDATE payments SET status = 'succeeded', stripe_payment_intent_id = $1 WHERE order_id = $2", paymentIntent.ID, paymentIntent.Metadata["order_id"])
		// if dbErr != nil {
		// 	s.logger.Error("Failed to update payment status to succeeded in DB", zap.Error(dbErr), zap.String("payment_intent_id", paymentIntent.ID))
		// 	return dbErr // This error will cause Stripe to retry the webhook
		// }

		// TODO: Mark the associated order as paid in 'orders' table
		// Example:
		// _, dbErr = s.db.Exec("UPDATE orders SET status = 'paid' WHERE id = $1", paymentIntent.Metadata["order_id"])
		// if dbErr != nil {
		// 	s.logger.Error("Failed to update order status to paid in DB", zap.Error(dbErr), zap.String("order_id", paymentIntent.Metadata["order_id"]))
		// 	return dbErr // This error will cause Stripe to retry the webhook
		// }
		s.logger.Info("Successfully processed payment_intent.succeeded (placeholders for DB ops)", zap.String("payment_intent_id", paymentIntent.ID))

	case "payment_intent.payment_failed":
		var paymentIntent stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err != nil {
			s.logger.Error("Error parsing webhook PII data for payment_intent.payment_failed", zap.Error(err), zap.String("event_id", event.ID))
			return fmt.Errorf("error parsing payment_intent.payment_failed: %w", err)
		}
		s.logger.Info("PaymentIntent payment failed",
			zap.String("payment_intent_id", paymentIntent.ID),
			zap.String("order_id", paymentIntent.Metadata["order_id"]),
			zap.String("failure_reason", string(paymentIntent.LastPaymentError.Code)), // Or paymentIntent.LastPaymentError.Message
		)

		// TODO: Update payment status in 'payments' table to 'failed'
		// Example:
		// _, dbErr := s.db.Exec("UPDATE payments SET status = 'failed', stripe_payment_intent_id = $1, failure_reason = $2 WHERE order_id = $3",
		// 	paymentIntent.ID, paymentIntent.LastPaymentError.Message, paymentIntent.Metadata["order_id"])
		// if dbErr != nil {
		// 	s.logger.Error("Failed to update payment status to failed in DB", zap.Error(dbErr), zap.String("payment_intent_id", paymentIntent.ID))
		// 	return dbErr
		// }
		s.logger.Info("Successfully processed payment_intent.payment_failed (placeholder for DB op)", zap.String("payment_intent_id", paymentIntent.ID))

	// TODO: Handle other event types as needed (e.g., charge.refunded, customer.subscription.created, etc.)
	default:
		s.logger.Info("Unhandled Stripe event type", zap.String("event_type", event.Type))
	}

	// 3. Return a success response to Stripe (implicitly by returning nil)
	// Stripe expects a 2xx response to acknowledge receipt of the webhook.
	// If an error is returned from this function, the calling HTTP handler should return a 5xx or 4xx,
	// which will cause Stripe to retry the webhook.
	return nil
}

// Helper function to be used in the HTTP handler for reading the request body
func ReadRequestBody(r *http.Request) ([]byte, error) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading request body: %w", err)
	}
	defer r.Body.Close()
	return body, nil
}
