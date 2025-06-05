package tutor_orchestrator

// Models for the Tutor Orchestrator will be defined here.
// This service might manage sessions with AI tutors, state of interactions,
// or coordinate between different AI/tutoring services.
// For now, this is a placeholder.

// ExampleTutorSession represents a tutoring session.
type ExampleTutorSession struct {
	ID        string `json:"id"`
	UserID    string `json:"user_id"`
	TutorType string `json:"tutor_type"` // e.g., "math_ai_v1", "language_tutor_basic"
	State     string `json:"state"`      // e.g., "active", "paused", "completed"
	Context   string `json:"context"`    // Could be JSON string holding session context
}
