-- Migration: 006_payment_tables.sql

-- Enable UUID extension if not already enabled (should be from previous migrations, but good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Assuming linkage to a user from the 'users' table
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT, -- Optional: Store Stripe Customer ID if you manage customers in Stripe
    amount BIGINT NOT NULL, -- Amount in smallest currency unit (e.g., cents)
    currency VARCHAR(10) NOT NULL, -- e.g., 'usd', 'eur'
    status VARCHAR(50) NOT NULL, -- e.g., 'requires_payment_method', 'processing', 'succeeded', 'failed'
    description TEXT, -- Optional description for the payment
    receipt_email TEXT, -- Optional: email for receipt
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Stores information about payment transactions.';
COMMENT ON COLUMN payments.user_id IS 'Foreign key referencing the user who made the payment.';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'Unique identifier for the payment intent from Stripe.';
COMMENT ON COLUMN payments.stripe_customer_id IS 'Stripe Customer ID, if applicable.';
COMMENT ON COLUMN payments.amount IS 'Amount in smallest currency unit (e.g., cents).';
COMMENT ON COLUMN payments.status IS 'Current status of the payment (e.g., requires_payment_method, succeeded, failed).';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer_id ON payments(stripe_customer_id);


-- Apply trigger to update updated_at timestamp
-- This assumes trigger_set_timestamp() function is available from a previous migration (e.g., 001_auth_initial_schema.sql or 005_curriculum_schema.sql)
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
      CREATE TRIGGER set_timestamp_payments
      BEFORE UPDATE ON payments
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
   ELSE
      RAISE NOTICE 'Function trigger_set_timestamp() does not exist. Skipping trigger creation for payments table.';
   END IF;
END
$$;

-- Down migration
-- DROP TABLE IF EXISTS payments;
-- Note: Dropping triggers is usually handled by dropping the table, or explicitly if needed.
-- DROP TRIGGER IF EXISTS set_timestamp_payments ON payments;
