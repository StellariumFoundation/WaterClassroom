package curriculum

import (
	"time"
)

// Curriculum corresponds to the "curricula" table
type Curriculum struct {
	ID             string    `json:"id" db:"id"`
	Name           string    `json:"name" db:"name"`
	Description    *string   `json:"description,omitempty" db:"description"`
	TargetAudience *string   `json:"target_audience,omitempty" db:"target_audience"`
	CountryKey     *string   `json:"country_key,omitempty" db:"country_key"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// Subject corresponds to the "subjects" table
type Subject struct {
	ID            string    `json:"id" db:"id"`
	CurriculumID  string    `json:"curriculum_id" db:"curriculum_id"`
	Name          string    `json:"name" db:"name"`
	Description   *string   `json:"description,omitempty" db:"description"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
	Lectures      []Lecture `json:"lectures,omitempty"` // Optional: to nest lectures under subjects
}

// Lecture corresponds to the "lectures" table
type Lecture struct {
	ID                        string    `json:"id" db:"id"`
	SubjectID                 string    `json:"subject_id" db:"subject_id"`
	Title                     string    `json:"title" db:"title"`
	LectureType               string    `json:"lecture_type" db:"lecture_type"` // e.g., 'text', 'video', 'interactive'
	ContentSourceType         *string   `json:"content_source_type,omitempty" db:"content_source_type"`
	Content                   *string   `json:"content,omitempty" db:"content"`
	EstimatedDurationMinutes *int      `json:"estimated_duration_minutes,omitempty" db:"estimated_duration_minutes"`
	AIGenerated               *bool     `json:"ai_generated,omitempty" db:"ai_generated"`
	ImagePlaceholderURL       *string   `json:"image_placeholder_url,omitempty" db:"image_placeholder_url"`
	Order                     *int      `json:"order,omitempty" db:"order"`
	CreatedAt                 time.Time `json:"created_at" db:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at" db:"updated_at"`
}
