package curriculum

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up the curriculum-related routes
func RegisterRoutes(apiGroup *gin.RouterGroup, handler *CurriculumHandler, authMiddleware gin.HandlerFunc) {
	curriculumRoutes := apiGroup.Group("/curricula")
	// Apply auth middleware to all curriculum routes for now, can be adjusted per-route later
	curriculumRoutes.Use(authMiddleware)
	{
		curriculumRoutes.POST("", handler.HandleCreateCurriculum)
		curriculumRoutes.GET("", handler.HandleGetCurriculums)
		curriculumRoutes.GET("/:id", handler.HandleGetCurriculumByID)
		curriculumRoutes.PUT("/:id", handler.HandleUpdateCurriculum)
		curriculumRoutes.DELETE("/:id", handler.HandleDeleteCurriculum)

		// Example for nested subject routes (could be top-level as well)
		// curriculumRoutes.POST("/:curriculumId/subjects", handler.HandleCreateSubject)
		// curriculumRoutes.GET("/:curriculumId/subjects", handler.HandleGetSubjects)
	}

	// Example for general subject or lecture routes if not nested under a specific curriculum in the URL
	// These might have different authorization requirements or be admin-only
	subjectRoutes := apiGroup.Group("/subjects")
	subjectRoutes.Use(authMiddleware) // Or a different middleware for admin roles
	{
		subjectRoutes.POST("", handler.HandleCreateSubject) // Generic subject creation?
		subjectRoutes.GET("", handler.HandleGetSubjects)     // List all subjects?
		// GET /subjects/:id - if subjects can be fetched directly
	}

	lectureRoutes := apiGroup.Group("/lectures")
	lectureRoutes.Use(authMiddleware) // Or a different middleware
	{
		// POST /lectures - (requires subject_id in body)
		lectureRoutes.GET("/:id", handler.HandleGetLecture)
		// Potentially:
		// POST "/subjects/:subjectId/lectures", handler.HandleCreateLectureForSubject
		// GET "/subjects/:subjectId/lectures", handler.HandleGetLecturesForSubject
	}

	handler.App.Logger.Info("Curriculum routes registered.")
}
