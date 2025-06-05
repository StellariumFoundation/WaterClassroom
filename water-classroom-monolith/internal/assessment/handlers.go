package assessment

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/water-classroom/water-classroom-monolith/internal/app"
	"go.uber.org/zap"
)

// AssessmentHandler holds dependencies for assessment routes
type AssessmentHandler struct {
	App *app.Application
	// Service *AssessmentService // To be added later
}

// NewAssessmentHandler creates a new AssessmentHandler
func NewAssessmentHandler(application *app.Application /*, service *AssessmentService*/) *AssessmentHandler {
	return &AssessmentHandler{
		App: application,
		// Service: service,
	}
}

// HandleGetAssessmentStatus example placeholder handler
func (h *AssessmentHandler) HandleGetAssessmentStatus(c *gin.Context) {
	assessmentID := c.Param("id")
	h.App.Logger.Info("HandleGetAssessmentStatus called", zap.String("assessment_id", assessmentID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "assessment_id": assessmentID})
}

// HandleSubmitAssessmentEvent example placeholder handler
func (h *AssessmentHandler) HandleSubmitAssessmentEvent(c *gin.Context) {
	h.App.Logger.Info("HandleSubmitAssessmentEvent called - Not Implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented"})
}
