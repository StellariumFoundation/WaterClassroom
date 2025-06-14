-- Migration: 009_notification_schema.sql
-- Placeholder for notification service schema.

-- Tables for storing notifications, user notification preferences, delivery channels, etc.
-- Example (to be detailed in a future task):
/*
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- e.g., 'GRADE_UPDATED', 'NEW_ANNOUNCEMENT', 'EVENT_REMINDER'
    title TEXT,
    message TEXT NOT NULL,
    data JSONB, -- Additional structured data related to the notification
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- If notifications can be updated (e.g., content change)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    in_app_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    -- Add more granular preferences per notification type if needed
    -- e.g., preferences JSONB
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply trigger_set_timestamp if available and needed
*/

-- For now, this migration is a placeholder.
SELECT NOW(); -- Minimal valid SQL to make the migration runnable.
