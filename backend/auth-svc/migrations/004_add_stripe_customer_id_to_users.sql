-- +goose Up
-- SQL in this section is executed when the migration is applied

ALTER TABLE users
ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;

CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back

ALTER TABLE users
DROP COLUMN IF EXISTS stripe_customer_id;

-- The index idx_users_stripe_customer_id will be dropped automatically when the column is dropped.
-- However, if you need to be explicit or if the database system doesn't do this (e.g. older MySQL versions):
-- DROP INDEX IF EXISTS idx_users_stripe_customer_id ON users;
-- For PostgreSQL and most modern systems, dropping the column handles the index.
