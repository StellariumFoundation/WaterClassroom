-- +goose Up
-- SQL in this section is executed when the migration is applied

-- Create extension for UUID generation if not already enabled by other services
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References users.id from auth-svc, assumed to be replicated or accessible
    stripe_payment_intent_id TEXT UNIQUE,
    amount BIGINT NOT NULL, -- Amount in smallest currency unit (e.g., cents)
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'requires_payment_method', 'succeeded', 'failed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_stripe_payment_intent_id ON transactions(stripe_payment_intent_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE, -- One active subscription per user, references users.id
    stripe_subscription_id TEXT UNIQUE,
    plan_id VARCHAR(100) NOT NULL, -- Identifier for the subscription plan (e.g., 'basic_monthly', 'premium_annual')
    status VARCHAR(50) NOT NULL, -- e.g., 'active', 'canceled', 'past_due', 'incomplete'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back

DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS transactions;
