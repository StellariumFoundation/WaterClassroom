-- +goose Up
-- SQL in this section is executed when the migration is applied

ALTER TABLE users
ADD COLUMN user_type VARCHAR(50),
ADD COLUMN classroom_code VARCHAR(50) NULL,
ADD COLUMN onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE;

-- You might want to add an index if user_type is frequently queried
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_onboarding_complete ON users(onboarding_complete);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back

ALTER TABLE users
DROP COLUMN IF EXISTS onboarding_complete,
DROP COLUMN IF EXISTS classroom_code,
DROP COLUMN IF EXISTS user_type;

-- The indexes will be dropped automatically when the columns are dropped (in PostgreSQL).
-- If you created indexes with specific names and want to be explicit:
-- DROP INDEX IF EXISTS idx_users_onboarding_complete;
-- DROP INDEX IF EXISTS idx_users_user_type;
