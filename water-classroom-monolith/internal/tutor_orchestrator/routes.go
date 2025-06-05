package tutor_orchestrator

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up the tutor orchestrator related routes.
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *TutorOrchestratorHandler, authMiddleware gin.HandlerFunc) {
	tutorRoutes := apiGroup.Group("/tutor") // Using a simpler group name "tutor"
	tutorRoutes.Use(authMiddleware)      // All tutor interaction routes require authentication
	{
		// Start a new tutoring session
		tutorRoutes.POST("/sessions", handler.HandleStartTutorSession)
		// Get status or details of a specific session
		tutorRoutes.GET("/sessions/:sessionId", handler.HandleGetTutorSessionStatus)
		// Potentially:
		// POST "/sessions/:sessionId/messages" -> handler.HandlePostMessageToTutor
		// GET  "/sessions/:sessionId/messages" -> handler.HandleGetSessionMessages
		// POST "/sessions/:sessionId/end" -> handler.HandleEndTutorSession
	}

	handler.App.Logger.Info("Tutor Orchestrator routes registered under /api/v1/tutor")
}
