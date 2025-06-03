package main

import (
	"encoding/json"
	"io" // Required for io.ReadAll
	"log"
	"net/http"
	"os"
	"strings" // Required for strings.Contains

	"github.com/company/payment-svc/internal" // Assuming this is the correct path to your internal package
	"github.com/gorilla/mux"
	"github.com/stripe/stripe-go/v76"
)

// Global Stripe service client
var stripeService *internal.StripeClient
var webhookSecretKey string // Global for simplicity, ideally from config instance

// CreatePaymentIntentRequest defines the expected request body for creating a payment intent.
type CreatePaymentIntentRequest struct {
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
}

func createPaymentIntentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CreatePaymentIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON request body: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Basic validation
	if req.Amount <= 0 {
		http.Error(w, "Invalid amount: must be greater than 0", http.StatusBadRequest)
		return
	}
	if req.Currency == "" {
		http.Error(w, "Invalid currency: must not be empty", http.StatusBadRequest)
		return
	}

	if stripeService == nil {
		log.Println("Error: Stripe service not initialized")
		http.Error(w, "Internal server error: Payment service not configured", http.StatusInternalServerError)
		return
	}

	pi, err := stripeService.CreatePaymentIntent(req.Amount, req.Currency)
	if err != nil {
		log.Printf("Error creating payment intent: %v", err)
		if stripeErr, ok := err.(*stripe.Error); ok {
			log.Printf("Stripe error details: Type=%s, Code=%s, Msg=%s, Param=%s",
				stripeErr.Type, stripeErr.Code, stripeErr.Msg, stripeErr.Param)
			http.Error(w, "Error processing payment", http.StatusInternalServerError)
		} else {
			http.Error(w, "Internal server error while creating payment intent", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]string{"client_secret": pi.ClientSecret}); err != nil {
		log.Printf("Error encoding success response: %v", err)
	}
}

func stripeWebhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body for webhook: %v", err)
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	signatureHeader := r.Header.Get("Stripe-Signature")
	if signatureHeader == "" {
		log.Println("Webhook error: Missing Stripe-Signature header")
		http.Error(w, "Missing Stripe-Signature header", http.StatusBadRequest)
		return
	}
	
	if stripeService == nil {
		log.Println("Error: Stripe service not initialized for webhook")
		http.Error(w, "Internal server error: Payment service not configured", http.StatusInternalServerError)
		return
	}


	err = stripeService.HandleWebhook(payload, signatureHeader, webhookSecretKey)
	if err != nil {
		log.Printf("Error handling webhook: %v", err)
		if stripeErr, ok := err.(*stripe.Error); ok {
			// Check if it's a signature verification error by inspecting the message.
			// This is a workaround due to issues resolving stripe.ErrorTypeSignatureVerification etc.
			errMsgLower := strings.ToLower(stripeErr.Msg)
			if strings.Contains(errMsgLower, "signature") || strings.Contains(errMsgLower, "verification") {
				log.Printf("Webhook signature verification failed: %s", stripeErr.Msg)
				http.Error(w, "Webhook signature verification failed", http.StatusBadRequest)
				return
			}
			// For other Stripe errors
			log.Printf("Stripe error processing webhook: Type=%s, Code=%s, Msg=%s", stripeErr.Type, stripeErr.Code, stripeErr.Msg)
			http.Error(w, "Error processing webhook (Stripe error)", http.StatusInternalServerError)
		} else {
			// For non-Stripe errors
			http.Error(w, "Error processing webhook (Internal error)", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(map[string]string{"status": "webhook processed"}); err != nil {
		log.Printf("Error encoding webhook success response: %v", err)
	}
}

func paymentHistoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Placeholder data
	history := []map[string]string{
		{"id": "txn_1", "date": "2023-01-15", "amount": "10.00", "currency": "USD", "status": "succeeded"},
		{"id": "txn_2", "date": "2023-01-18", "amount": "25.50", "currency": "USD", "status": "succeeded"},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(history); err != nil {
		log.Printf("Error encoding payment history response: %v", err)
		// Hard to send a different status code if headers are already written
	}
}

func main() {
	stripeSecretKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeSecretKey == "" {
		log.Println("Warning: STRIPE_SECRET_KEY environment variable not set. Using a default test key.")
		stripeSecretKey = "sk_test_YOUR_STRIPE_SECRET_KEY"
	}
	stripeService = internal.NewStripeClient(stripeSecretKey)

	// TODO: Load webhook secret from environment variables or a secure config management system.
	// For this example, it's hardcoded, which is NOT recommended for production.
	webhookSecretKeyEnv := os.Getenv("STRIPE_WEBHOOK_SECRET")
	if webhookSecretKeyEnv == "" {
		log.Println("Warning: STRIPE_WEBHOOK_SECRET environment variable not set. Using a default test key.")
		webhookSecretKey = "whsec_test_YOUR_WEBHOOK_SECRET" // Hardcoded test key
	} else {
		webhookSecretKey = webhookSecretKeyEnv
	}


	r := mux.NewRouter()
	r.HandleFunc("/create-payment-intent", createPaymentIntentHandler).Methods(http.MethodPost)
	r.HandleFunc("/stripe-webhook", stripeWebhookHandler).Methods(http.MethodPost) // Added webhook route
	r.HandleFunc("/payments/history", paymentHistoryHandler).Methods(http.MethodGet) // Added history route

	log.Println("Starting payment service on :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
