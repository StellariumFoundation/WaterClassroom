package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	// "github.com/company/payment-svc/internal" // Uncomment when internal.CreatePaymentIntent and internal.HandleWebhook are ready
)

// createPaymentIntentHandler handles requests to create a payment intent.
// TODO: Replace with actual call to internal.CreatePaymentIntent
func createPaymentIntentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Placeholder: Parse request body (amount, currency)
	// var reqBody struct {
	// 	Amount   int64  `json:"amount"`
	// 	Currency string `json:"currency"`
	// }
	// if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
	// 	http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
	// 	return
	// }

	log.Println("Placeholder: /payments/create-intent called")
	// pi, err := internal.CreatePaymentIntent(reqBody.Amount, reqBody.Currency)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("Error creating payment intent: %v", err), http.StatusInternalServerError)
	// 	return
	// }

	// w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(pi)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "placeholder for create-intent"})
	log.Println("Create payment intent request processed (placeholder)")
}

// stripeWebhookHandler handles incoming Stripe webhooks.
// TODO: Replace with actual call to internal.HandleWebhook
func stripeWebhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// const MaxBodyBytes = int64(65536) // 64KB
	// r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	// payload, err := io.ReadAll(r.Body)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("Error reading request body: %v", err), http.StatusServiceUnavailable)
	// 	return
	// }
	// signature := r.Header.Get("Stripe-Signature")

	log.Println("Placeholder: /payments/webhook called")
	// if err := internal.HandleWebhook(payload, signature); err != nil {
	// 	http.Error(w, fmt.Sprintf("Error handling webhook: %v", err), http.StatusBadRequest)
	// 	return
	// }

	w.WriteHeader(http.StatusOK)
	io.WriteString(w, `{"status": "webhook received (placeholder)"}`)
	log.Println("Stripe webhook processed (placeholder)")
}

// paymentHistoryHandler handles requests to retrieve payment history.
// TODO: Implement actual logic for fetching payment history.
func paymentHistoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET method is allowed", http.StatusMethodNotAllowed)
		return
	}

	log.Println("Placeholder: /payments/history called")
	w.Header().Set("Content-Type", "application/json")
	// Placeholder response
	json.NewEncoder(w).Encode([]map[string]string{
		{"id": "txn_1", "amount": "1000", "currency": "usd", "status": "succeeded", "date": "2024-05-30"},
		{"id": "txn_2", "amount": "500", "currency": "usd", "status": "failed", "date": "2024-05-29"},
	})
	log.Println("Payment history request processed (placeholder)")
}

func main() {
	http.HandleFunc("/payments/create-intent", createPaymentIntentHandler)
	http.HandleFunc("/payments/webhook", stripeWebhookHandler)
	http.HandleFunc("/payments/history", paymentHistoryHandler)

	port := "8081" // As defined in Dockerfile.dev and configs
	log.Printf("Payment service starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
