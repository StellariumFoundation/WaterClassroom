-- Migration: 010_tutor_orchestrator_schema.sql
-- Placeholder for tutor_orchestrator service schema.

-- Tables for managing tutor sessions, interaction logs, AI model configurations, etc.
-- Example (to be detailed in a future task):
/*
CREATE TABLE IF NOT EXISTS tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tutor_id VARCHAR(255), -- Could be an internal ID for a specific AI tutor configuration or external ID
    tutor_type VARCHAR(100), -- e.g., 'math_explainer_v1', 'history_chat_v2'
    session_state VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'ended', 'error'
    session_context JSONB, -- Stores current conversation history, variables, goals for the session
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutor_sessions_user_id ON tutor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_tutor_id ON tutor_sessions(tutor_id);

CREATE TABLE IF NOT EXISTS tutor_interaction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sender_type VARCHAR(50), -- 'user', 'tutor', 'system'
    message_content TEXT,
    metadata JSONB -- e.g., sentiment, intent, recognized entities
);
CREATE INDEX IF NOT EXISTS idx_tutor_interaction_logs_session_id ON tutor_interaction_logs(session_id);

-- Apply trigger_set_timestamp if available and needed
*/

-- For now, this migration is a placeholder.
SELECT NOW(); -- Minimal valid SQL to make the migration runnable.
