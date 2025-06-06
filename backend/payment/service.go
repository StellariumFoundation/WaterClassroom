package payment

import (
	"context"
	"fmt"
	"time"

	"github.com/water-classroom/backend/app"
	"go.uber.org/zap"
)

// PaymentService provides an interface for managing payment records in the database.
type PaymentService struct {
	App *app.Application
	// DB *sql.DB // or a more specific DB interface/repository
}

// NewPaymentService creates a new PaymentService.
func NewPaymentService(application *app.Application) *PaymentService {
	return &PaymentService{
		App: application,
		// DB:  application.DB, // Initialize DB connection if needed directly
	}
}

// CreatePaymentRecord creates a new payment record in the database.
func (s *PaymentService) CreatePaymentRecord(ctx context.Context, payment *Payment) error {
	s.App.Logger.Info("PaymentService: CreatePaymentRecord called", zap.Any("payment", payment))

	query := `
		INSERT INTO payments (id, user_id, stripe_payment_intent_id, stripe_customer_id, amount, currency, status, description, receipt_email, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`
	_, err := s.App.DB.ExecContext(ctx, query,
		payment.ID,
		payment.UserID,
		payment.StripePaymentIntentID,
		payment.StripeCustomerID,
		payment.Amount,
		payment.Currency,
		payment.Status,
		payment.Description,
		payment.ReceiptEmail,
		payment.CreatedAt,
		payment.UpdatedAt,
	)

	if err != nil {
		s.App.Logger.Error("Error creating payment record in DB", zap.Error(err))
		return fmt.Errorf("failed to create payment record: %w", err)
	}
	s.App.Logger.Info("Payment record created successfully in DB", zap.String("payment_id", payment.ID))
	return nil
}

// UpdatePaymentStatusByIntentID updates the status of a payment record based on the Stripe Payment Intent ID.
func (s *PaymentService) UpdatePaymentStatusByIntentID(ctx context.Context, paymentIntentID string, status string) error {
	s.App.Logger.Info("PaymentService: UpdatePaymentStatusByIntentID called",
		zap.String("payment_intent_id", paymentIntentID),
		zap.String("new_status", status),
	)

	query := `
		UPDATE payments
		SET status = $1, updated_at = $2
		WHERE stripe_payment_intent_id = $3
	`
	result, err := s.App.DB.ExecContext(ctx, query, status, time.Now(), paymentIntentID)
	if err != nil {
		s.App.Logger.Error("Error updating payment status in DB",
			zap.String("payment_intent_id", paymentIntentID),
			zap.Error(err),
		)
		return fmt.Errorf("failed to update payment status for intent %s: %w", paymentIntentID, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		s.App.Logger.Error("Error getting rows affected after payment status update", zap.Error(err))
		return fmt.Errorf("failed to get rows affected for payment status update: %w", err)
	}
	if rowsAffected == 0 {
		s.App.Logger.Warn("No payment record found to update for Stripe Payment Intent ID", zap.String("payment_intent_id", paymentIntentID))
		return fmt.Errorf("no payment record found for payment intent ID: %s", paymentIntentID) // Or handle as not an error if appropriate
	}

	s.App.Logger.Info("Payment status updated successfully in DB",
		zap.String("payment_intent_id", paymentIntentID),
		zap.String("new_status", status),
		zap.Int64("rows_affected", rowsAffected),
	)
	return nil
}

// GetPaymentsByUserID retrieves all payment records for a given user ID.
func (s *PaymentService) GetPaymentsByUserID(ctx context.Context, userID string) ([]*Payment, error) {
	s.App.Logger.Info("PaymentService: GetPaymentsByUserID called", zap.String("user_id", userID))

	query := `
		SELECT id, user_id, stripe_payment_intent_id, stripe_customer_id, amount, currency, status, description, receipt_email, created_at, updated_at
		FROM payments
		WHERE user_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.App.DB.QueryContext(ctx, query, userID)
	if err != nil {
		s.App.Logger.Error("Error querying payments by user ID from DB", zap.String("user_id", userID), zap.Error(err))
		return nil, fmt.Errorf("failed to query payments for user %s: %w", userID, err)
	}
	defer rows.Close()

	var payments []*Payment
	for rows.Next() {
		var p Payment
		err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.StripePaymentIntentID,
			&p.StripeCustomerID,
			&p.Amount,
			&p.Currency,
			&p.Status,
			&p.Description,
			&p.ReceiptEmail,
			&p.CreatedAt,
			&p.UpdatedAt,
		)
		if err != nil {
			s.App.Logger.Error("Error scanning payment row", zap.Error(err))
			return nil, fmt.Errorf("failed to scan payment row: %w", err)
		}
		payments = append(payments, &p)
	}

	if err = rows.Err(); err != nil {
		s.App.Logger.Error("Error iterating payment rows", zap.Error(err))
		return nil, fmt.Errorf("error iterating payment rows: %w", err)
	}

	s.App.Logger.Info("Successfully retrieved payments for user", zap.String("user_id", userID), zap.Int("count", len(payments)))
	return payments, nil
}
