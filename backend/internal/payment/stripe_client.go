package payment

import (
	// "encoding/json" // Keep if detailed unmarshalling in HandleWebhook is restored
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
	"github.com/stripe/stripe-go/v76/webhook"
	// "github.com/water-classroom/water-classroom-monolith/internal/app" // For app.Logger
	"go.uber.org/zap"
)

// PaymentIntentCreator defines an interface for creating Stripe PaymentIntents.
type PaymentIntentCreator interface {
	New(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error)
}

// DefaultPaymentIntentCreator is the default implementation that calls the Stripe SDK.
type DefaultPaymentIntentCreator struct{}

// New implements the PaymentIntentCreator interface for DefaultPaymentIntentCreator.
func (d *DefaultPaymentIntentCreator) New(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
	return paymentintent.New(params)
}

// StripeWebhookConstructor defines an interface for constructing Stripe webhook events.
type StripeWebhookConstructor interface {
	ConstructEvent(payload []byte, signatureHeader string, secret string) (stripe.Event, error)
}

// DefaultStripeWebhookConstructor is the default implementation that calls the Stripe SDK.
type DefaultStripeWebhookConstructor struct{}

// ConstructEvent implements the StripeWebhookConstructor interface.
func (d *DefaultStripeWebhookConstructor) ConstructEvent(payload []byte, signatureHeader string, secret string) (stripe.Event, error) {
	return webhook.ConstructEvent(payload, signatureHeader, secret)
}

// StripeClient holds configuration for Stripe operations.
type StripeClient struct {
	App       *app.Application // For logger and config access
	PIClient  PaymentIntentCreator
	WHClient  StripeWebhookConstructor
	SecretKey string // API Secret Key (still passed for directness, though could come from App.Config)
}

// NewStripeClient creates a new StripeClient.
// The Stripe secret key is set globally for the stripe-go package.
func NewStripeClient(application *app.Application, secretKey string) *StripeClient {
	if secretKey == "" && application.Config.StripeSecretKey == "" {
		 application.Logger.Warn("Stripe secret key is not configured in app config or passed directly.")
		 // Potentially return an error or a "disabled" client
	}

	// Prefer key from explicit config if available, otherwise use direct param if any
	// The global key is important for the stripe SDK calls made by DefaultPaymentIntentCreator etc.
	finalSecretKey := secretKey
	if application.Config.StripeSecretKey != "" {
		finalSecretKey = application.Config.StripeSecretKey
	}

	if finalSecretKey != "" {
		stripe.Key = finalSecretKey
		application.Logger.Info("Stripe client initialized with secret key.")
	} else {
		application.Logger.Error("Stripe client could not be initialized: No secret key provided.")
		// Depending on policy, might panic or return nil/error
	}


	return &StripeClient{
		App:       application,
		PIClient:  &DefaultPaymentIntentCreator{},
		WHClient:  &DefaultStripeWebhookConstructor{},
		SecretKey: finalSecretKey, // Store the key used, if needed for non-global uses
	}
}

// CreatePaymentIntent creates a new Stripe PaymentIntent using the PIClient.
func (sc *StripeClient) CreatePaymentIntent(amount int64, currency string) (*stripe.PaymentIntent, error) {
	if sc.SecretKey == "" { // Check if client was initialized without a key
		sc.App.Logger.Error("Stripe client called without a secret key.")
		return nil, stripe.InvalidRequestError{Msg: "Stripe client not configured with a secret key."}
	}
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		// Consider adding metadata, like user_id, or your internal payment_id
		// Metadata: map[string]string{
		//  "user_id": "some_user_id",
		//  "internal_payment_id": "our_db_payment_id",
		// },
	}
	pi, err := sc.PIClient.New(params)
	if err != nil {
		sc.App.Logger.Error("Failed to create Stripe payment intent", zap.Error(err))
		return nil, err
	}
	sc.App.Logger.Info("Stripe payment intent created", zap.String("payment_intent_id", pi.ID))
	return pi, nil
}

// HandleWebhook constructs and processes a Stripe webhook event.
// It will call a PaymentService method to update the database in a future task.
func (sc *StripeClient) HandleWebhook(payload []byte, signatureHeader string, webhookSecret string) (*stripe.Event, error) {
	if webhookSecret == "" {
		sc.App.Logger.Error("Stripe webhook secret is not configured.")
		return nil, stripe.InvalidRequestError{Msg: "Stripe webhook secret not configured."}
	}
	event, err := sc.WHClient.ConstructEvent(payload, signatureHeader, webhookSecret)
	if err != nil {
		sc.App.Logger.Error("Error constructing webhook event", zap.Error(err))
		return nil, err
	}

	sc.App.Logger.Info("Stripe webhook event received", zap.String("event_id", event.ID), zap.String("event_type", string(event.Type)))

	// TODO: In a future task, unmarshal event.Data.Object based on event.Type
	// and call a method on PaymentService to update the database record.
	// Example:
	// var paymentIntent stripe.PaymentIntent
	// if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err == nil {
	//    paymentID := paymentIntent.ID // This is stripe's PI ID
	//    status := paymentIntent.Status
	//    // Call service: sc.PaymentDBService.UpdatePaymentStatusByIntentID(c.Request.Context(), paymentID, string(status))
	// }


	switch event.Type {
	case stripe.EventTypePaymentIntentSucceeded:
		sc.App.Logger.Info("PaymentIntent succeeded", zap.String("event_id", event.ID))
		// Further processing: update DB record to 'succeeded', fulfill order, etc.
	case stripe.EventTypePaymentIntentPaymentFailed:
		sc.App.Logger.Info("PaymentIntent failed", zap.String("event_id", event.ID))
		// Further processing: update DB record to 'failed', notify user, etc.
	case stripe.EventTypePaymentIntentRequiresPaymentMethod:
		sc.App.Logger.Info("PaymentIntent requires payment method", zap.String("event_id", event.ID))
	case stripe.EventTypePaymentIntentProcessing:
		sc.App.Logger.Info("PaymentIntent processing", zap.String("event_id", event.ID))
	// Add more event types as needed (e.g., charge.succeeded, customer.subscription.created, etc.)
	default:
		sc.App.Logger.Info("Unhandled Stripe event type", zap.String("event_type", string(event.Type)))
	}

	return &event, nil // Return the event for the handler to potentially use
}
