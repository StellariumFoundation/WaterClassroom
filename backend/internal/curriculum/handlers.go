package curriculum

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/water-classroom/backend/internal/app"
	"go.uber.org/zap"
)

// CurriculumHandler holds dependencies for curriculum routes
type CurriculumHandler struct {
	App *app.Application
	// Service *CurriculumService // To be added later
}

// HandleCreateCurriculum handles creation of a new curriculum
func (h *CurriculumHandler) HandleCreateCurriculum(c *gin.Context) {
	h.App.Logger.Info("HandleCreateCurriculum called - Not Implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented"})
}

// HandleGetCurriculums handles listing all curriculums
func (h *CurriculumHandler) HandleGetCurriculums(c *gin.Context) {
	h.App.Logger.Info("HandleGetCurriculums called - Not Implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented"})
}

// HandleGetCurriculumByID handles fetching a single curriculum by its ID
func (h *CurriculumHandler) HandleGetCurriculumByID(c *gin.Context) {
	curriculumID := c.Param("id")
	h.App.Logger.Info("HandleGetCurriculumByID called", zap.String("curriculum_id", curriculumID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "curriculum_id": curriculumID})
}

// HandleUpdateCurriculum handles updating an existing curriculum
func (h *CurriculumHandler) HandleUpdateCurriculum(c *gin.Context) {
	curriculumID := c.Param("id")
	h.App.Logger.Info("HandleUpdateCurriculum called", zap.String("curriculum_id", curriculumID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "curriculum_id": curriculumID})
}

// HandleDeleteCurriculum handles deleting a curriculum
func (h *CurriculumHandler) HandleDeleteCurriculum(c *gin.Context) {
	curriculumID := c.Param("id")
	h.App.Logger.Info("HandleDeleteCurriculum called", zap.String("curriculum_id", curriculumID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "curriculum_id": curriculumID})
}

// HandleCreateSubject handles creation of a new subject for a curriculum
func (h *CurriculumHandler) HandleCreateSubject(c *gin.Context) {
	// curriculumID := c.Param("curriculumId") // Assuming nested route
	h.App.Logger.Info("HandleCreateSubject called - Not Implemented" /*, zap.String("curriculum_id", curriculumID)*/)
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented"})
}

// HandleGetSubjects handles listing subjects (perhaps for a curriculum or all)
func (h *CurriculumHandler) HandleGetSubjects(c *gin.Context) {
	// curriculumID := c.Query("curriculumId")
	h.App.Logger.Info("HandleGetSubjects called - Not Implemented" /*, zap.String("curriculum_id_filter", curriculumID)*/)
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented"})
}

// HandleGetLecture handles fetching a single lecture
func (h *CurriculumHandler) HandleGetLecture(c *gin.Context) {
	lectureID := c.Param("id") // Or subjectId and lectureId if nested
	h.App.Logger.Info("HandleGetLecture called", zap.String("lecture_id", lectureID), zap.String("status", "Not Implemented"))
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not Implemented", "lecture_id": lectureID})
}
