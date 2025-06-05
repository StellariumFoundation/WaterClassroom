package payment

import (
	"time"
)

// Payment corresponds to the "payments" table
type Payment struct {
	ID                     string    `json:"id" db:"id"`
	UserID                 string    `json:"user_id" db:"user_id"`
	StripePaymentIntentID  string    `json:"stripe_payment_intent_id" db:"stripe_payment_intent_id"`
	StripeCustomerID       *string   `json:"stripe_customer_id,omitempty" db:"stripe_customer_id"`
	Amount                 int64     `json:"amount" db:"amount"` // Amount in smallest currency unit
	Currency               string    `json:"currency" db:"currency"`
	Status                 string    `json:"status" db:"status"`
	Description            *string   `json:"description,omitempty" db:"description"`
	ReceiptEmail           *string   `json:"receipt_email,omitempty" db:"receipt_email"`
	CreatedAt              time.Time `json:"created_at" db:"created_at"`
	UpdatedAt              time.Time `json:"updated_at" db:"updated_at"`
}

// CreatePaymentIntentRequest defines the expected request body for creating a payment intent.
type CreatePaymentIntentRequest struct {
	Amount      int64  `json:"amount" binding:"required"`   // Amount in smallest currency unit
	Currency    string `json:"currency" binding:"required"`
	Description string `json:"description,omitempty"`      // Optional: description for the payment
	// UserID will be injected from auth middleware
}

// CreatePaymentIntentResponse defines the response for creating a payment intent
type CreatePaymentIntentResponse struct {
	ClientSecret   string `json:"client_secret"`
	PaymentID      string `json:"payment_id"` // The ID of the record created in our DB
	PaymentStatus  string `json:"payment_status"`
}

// PaymentHistoryItem defines a single item in the payment history response
type PaymentHistoryItem struct {
	PaymentID     string    `json:"payment_id"`
	Date          time.Time `json:"date"`
	Amount        int64     `json:"amount"` // Amount in smallest currency unit
	Currency      string    `json:"currency"`
	Status        string    `json:"status"`
	Description   *string   `json:"description,omitempty"`
}

// PaymentHistoryResponse defines the structure for the payment history list
type PaymentHistoryResponse struct {
	History []PaymentHistoryItem `json:"history"`
}
