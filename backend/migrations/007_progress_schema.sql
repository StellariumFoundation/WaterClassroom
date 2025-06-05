-- Migration: 007_progress_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: user_progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Assuming users table from auth (001_auth_initial_schema.sql)
    item_id UUID NOT NULL, -- Generic ID for course, lesson, quiz etc.
    item_type VARCHAR(50) NOT NULL, -- e.g., 'lesson', 'quiz', 'course', 'subject', 'lecture'
    status VARCHAR(50) NOT NULL, -- e.g., 'not_started', 'started', 'in_progress', 'completed', 'passed', 'failed', 'skipped'
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    score INTEGER, -- Could be a percentage, raw score, etc.
    details JSONB, -- For storing arbitrary data like answers to a quiz, specific interactions, etc.
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_progress IS 'Tracks user progress on various learning items.';
COMMENT ON COLUMN user_progress.item_id IS 'Identifier for the learning item (e.g., curriculum_id, subject_id, lecture_id).';
COMMENT ON COLUMN user_progress.item_type IS 'Type of the learning item (e.g., ''curriculum'', ''subject'', ''lecture'', ''quiz'').';
COMMENT ON COLUMN user_progress.status IS 'Completion or interaction status of the item.';
COMMENT ON COLUMN user_progress.details IS 'Flexible field for additional progress data, like quiz answers or interaction logs.';


-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id_item ON user_progress(user_id, item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_item_id_item_type ON user_progress(item_id, item_type); -- For querying all users' progress on a specific item
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);


-- Apply trigger to update updated_at timestamp
-- This assumes trigger_set_timestamp() function is available from a previous migration.
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
      CREATE TRIGGER set_timestamp_user_progress
      BEFORE UPDATE ON user_progress
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
   ELSE
      RAISE NOTICE 'Function trigger_set_timestamp() does not exist. Skipping trigger creation for user_progress table.';
   END IF;
END
$$;

-- Down migration
-- DROP TABLE IF EXISTS user_progress;
-- DROP TRIGGER IF EXISTS set_timestamp_user_progress ON user_progress;
