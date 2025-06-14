package progress

import "time"

// Models for progress tracking will be defined here.
// e.g., UserProgress, CourseCompletion, QuizAttempt, etc.

// UserProgress reflects the structure of the user_progress table from the migration.
type UserProgress struct {
	ID                 string     `json:"id" db:"id"`
	UserID             string     `json:"user_id" db:"user_id"`
	ItemID             string     `json:"item_id" db:"item_id"` // Generic ID for course, lesson, quiz etc.
	ItemType           string     `json:"item_type" db:"item_type"` // e.g., 'lesson', 'quiz', 'course'
	Status             string     `json:"status" db:"status"`       // e.g., 'started', 'completed', 'passed', 'failed'
	ProgressPercentage *int       `json:"progress_percentage,omitempty" db:"progress_percentage"`
	Score              *int       `json:"score,omitempty" db:"score"`
	CompletedAt        *time.Time `json:"completed_at,omitempty" db:"completed_at"`
	CreatedAt          time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at" db:"updated_at"`
}
