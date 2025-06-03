package internal

import (
	"log" // Basic logger, could be replaced with a structured logger in a real app

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
	"github.com/stripe/stripe-go/v76/webhook"
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
	PIClient  PaymentIntentCreator
	WHClient  StripeWebhookConstructor
	SecretKey string // API Secret Key
}

// NewStripeClient creates a new StripeClient.
func NewStripeClient(secretKey string) *StripeClient {
	stripe.Key = secretKey // Set the global API key for the Stripe SDK
	return &StripeClient{
		PIClient:  &DefaultPaymentIntentCreator{},
		WHClient:  &DefaultStripeWebhookConstructor{},
		SecretKey: secretKey,
	}
}

// CreatePaymentIntent creates a new Stripe PaymentIntent using the PIClient.
func (sc *StripeClient) CreatePaymentIntent(amount int64, currency string) (*stripe.PaymentIntent, error) {
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
	}
	pi, err := sc.PIClient.New(params)
	if err != nil {
		return nil, err
	}
	return pi, nil
}

// HandleWebhook constructs and processes a Stripe webhook event.
func (sc *StripeClient) HandleWebhook(payload []byte, signatureHeader string, webhookSecret string) error {
	event, err := sc.WHClient.ConstructEvent(payload, signatureHeader, webhookSecret)
	if err != nil {
		// Log the error, could be a specific logger in a real app
		log.Printf("Error constructing webhook event: %v", err)
		return err // Propagate the error (e.g., signature verification failed)
	}

	// For logging event data safely, especially map access like event.Data.Object["id"]
	// It's better to unmarshal event.Data.Raw into a known struct if you need specific fields.
	// For this task, we'll keep logging simple and focus on event.Type.

	switch event.Type {
	case stripe.EventTypePaymentIntentSucceeded:
		// var paymentIntent stripe.PaymentIntent
		// if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err == nil {
		// 	log.Printf("Handling %s event for ID: %s", event.Type, paymentIntent.ID)
		// } else {
		// 	log.Printf("Handling %s event, error unmarshalling data: %v", event.Type, err)
		// }
		log.Printf("Handling event: %s", event.Type)
	case stripe.EventTypePaymentIntentPaymentFailed:
		// var paymentIntent stripe.PaymentIntent
		// if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err == nil {
		//  log.Printf("Handling %s event for ID: %s", event.Type, paymentIntent.ID)
		// } else {
		// 	log.Printf("Handling %s event, error unmarshalling data: %v", event.Type, err)
		// }
		log.Printf("Handling event: %s", event.Type)
	default:
		log.Printf("Unhandled event type: %s", event.Type)
	}

	return nil
}
