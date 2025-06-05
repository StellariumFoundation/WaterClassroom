-- +goose Up
-- SQL in this section is executed when the migration is applied

ALTER TABLE users
ADD COLUMN selected_curriculum_id VARCHAR(255) NULL;

-- Optional: Add an index if you anticipate querying users by their selected curriculum often
-- CREATE INDEX IF NOT EXISTS idx_users_selected_curriculum_id ON users(selected_curriculum_id);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back

ALTER TABLE users
DROP COLUMN IF EXISTS selected_curriculum_id;
