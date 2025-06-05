-- Migration: 008_assessment_schema.sql
-- Placeholder for assessment service schema.

-- Tables for assessments, questions, user attempts, answers, scores, etc., will be defined here.
-- Example (to be detailed in a future task):
/*
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID REFERENCES curricula(id), -- Optional link to curriculum
    subject_id UUID REFERENCES subjects(id),     -- Optional link to subject
    lecture_id UUID REFERENCES lectures(id),     -- Optional link to lecture
    title TEXT NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50), -- e.g., 'quiz', 'exam', 'homework'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50), -- e.g., 'multiple_choice', 'short_answer', 'essay'
    options JSONB, -- For multiple choice options
    correct_answer TEXT, -- Or JSONB for complex answers
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply trigger_set_timestamp if available and needed
*/

-- For now, this migration is a placeholder.
SELECT NOW(); -- Minimal valid SQL to make the migration runnable.
