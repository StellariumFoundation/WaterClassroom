package assessment

import (
	"github.com/gin-gonic/gin"
	// "github.com/water-classroom/water-classroom-monolith/internal/app" // Not strictly needed here if handler has App
)

// RegisterRoutes sets up the assessment-related routes.
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *AssessmentHandler, authMiddleware gin.HandlerFunc) {
	assessmentRoutes := apiGroup.Group("/assessments")
	assessmentRoutes.Use(authMiddleware) // Assuming most assessment routes require auth
	{
		assessmentRoutes.GET("/:id/status", handler.HandleGetAssessmentStatus)
		assessmentRoutes.POST("/submit", handler.HandleSubmitAssessmentEvent)
		// Add more placeholder routes as needed, e.g.:
		// assessmentRoutes.POST("", handler.HandleCreateAssessment)
		// assessmentRoutes.GET("", handler.HandleListAssessments)
		// assessmentRoutes.GET("/:id", handler.HandleGetAssessmentDetail)
	}

	handler.App.Logger.Info("Assessment routes registered under /api/v1/assessments")
}
