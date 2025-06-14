-- Migration: 001_create_curriculum_tables.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: curricula
CREATE TABLE curricula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    target_audience VARCHAR(255),
    country_key VARCHAR(10), -- e.g., 'us', 'gb', 'generic'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE curricula IS 'Stores information about different curricula available.';
COMMENT ON COLUMN curricula.country_key IS 'Identifier for the country this curriculum is primarily associated with.';

-- Table: subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE subjects IS 'Stores information about subjects within a curriculum.';
COMMENT ON COLUMN subjects.curriculum_id IS 'Foreign key referencing the curriculum this subject belongs to.';

-- Table: lectures
CREATE TABLE lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lecture_type VARCHAR(50) NOT NULL, -- e.g., 'text', 'video', 'interactive', 'game_placeholder'
    content_source_type VARCHAR(50) DEFAULT 'text_content', -- Describes what the 'content' field holds: 'text_content', 'video_url', 'html_file_path', 'interactive_config_url'
    content TEXT, -- Actual text, URL, or path to HTML/config file
    estimated_duration_minutes INTEGER,
    ai_generated BOOLEAN DEFAULT FALSE,
    image_placeholder_url TEXT, -- URL for a representative image if applicable
    "order" INTEGER DEFAULT 0, -- To specify order within a subject
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE lectures IS 'Stores information about individual lectures within a subject.';
COMMENT ON COLUMN lectures.subject_id IS 'Foreign key referencing the subject this lecture belongs to.';
COMMENT ON COLUMN lectures.lecture_type IS 'The primary nature of the lecture content.';
COMMENT ON COLUMN lectures.content_source_type IS 'Indicates how to interpret the content field (e.g., direct text, a URL, a file path).';
COMMENT ON COLUMN lectures.content IS 'The main content of the lecture, its interpretation depends on content_source_type.';
COMMENT ON COLUMN lectures."order" IS 'Numerical order of the lecture within its subject.';

-- Create indexes for foreign keys to improve query performance
CREATE INDEX idx_subjects_curriculum_id ON subjects(curriculum_id);
CREATE INDEX idx_lectures_subject_id ON lectures(subject_id);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER set_timestamp_curricula
BEFORE UPDATE ON curricula
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subjects
BEFORE UPDATE ON subjects
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_lectures
BEFORE UPDATE ON lectures
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

[end of backend/migrations/005_curriculum_schema.sql]
