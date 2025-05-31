package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock" // For mocking database interactions
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert" // For assertions
	"go.uber.org/zap"                   // For logger, if Application struct requires it
	// "github.com/golang-jwt/jwt/v5" // If needed for generating mock tokens
)

// Helper function to create a mock Application instance for testing
func setupTestApp(db *sql.DB) *Application {
	// For simplicity, using a Nop logger. In real tests, you might want a test logger.
	logger, _ := zap.NewDevelopment() // Or zap.NewNop()

	// Initialize a minimal config or use a mock config
	testConfig := &Config{
		// Populate with necessary config fields if your handlers depend on them
		// For handleUpdateCurrentUser, JWT keys might be relevant if authMiddleware is strictly tested here.
		// However, authMiddleware is often tested separately or its effect (setting userID) is mocked.
	}

	return &Application{
		DB:     db,
		Logger: logger,
		Config: testConfig,
		// Initialize other fields like Router, PrivateKey, PublicKey if needed for the specific test.
	}
}

// Helper function to create a Gin context with an authenticated user ID
func getTestGinContext(recorder *httptest.ResponseRecorder, userID string) *gin.Context {
	gin.SetMode(gin.TestMode)
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = &http.Request{
		Header: make(http.Header),
	}
	// Mock the effect of authMiddleware: setting the userId in the context
	ctx.Set("userId", userID)
	return ctx
}

func TestHandleUpdateCurrentUser(t *testing.T) {
	db, mock, err := sqlmock.New() // sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual)) for exact query matching
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db) // Create a test app instance with the mock DB

	const testUserID = "user-test-id-123"

	// --- Test Scenarios ---
	tests := []struct {
		name                 string
		requestBody          UpdateCurrentUserRequest
		mockDBExpectations   func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest)
		expectedStatusCode   int
		expectUserResponse   bool // Whether to expect a CurrentUserResponse in the body
		expectedDisplayName  string
		expectedAvatarURL    string // Use "" for NULL or empty string, depending on how CurrentUserResponse serializes it
	}{
		{
			name: "successful name update",
			requestBody: UpdateCurrentUserRequest{
				DisplayName: strPtr("New Test Name"),
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest) {
				// Expect the UPDATE query
				// Note: The exact query depends on dynamic construction. Using RegexpMatcher for flexibility.
				// Example: sqlmock.ExpectExec("UPDATE users SET display_name = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2")...
				mock.ExpectExec("UPDATE users SET display_name = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs("New Test Name", testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1)) // 1 row affected

				// Expect the SELECT query to fetch updated user
				rows := sqlmock.NewRows([]string{"id", "display_name", "email", "avatar_url", "role", "is_verified", "user_type", "classroom_code", "onboarding_complete", "selected_curriculum_id"}).
					AddRow(testUserID, "New Test Name", "test@example.com", sql.NullString{String: "", Valid: false}, "student", true, sql.NullString{}, sql.NullString{}, true, sql.NullString{})
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
			},
			expectedStatusCode:   http.StatusOK,
			expectUserResponse:   true,
			expectedDisplayName:  "New Test Name",
			expectedAvatarURL:    "", // Assuming avatar was null/empty and CurrentUserResponse reflects that
		},
		{
			name: "successful avatar_url update",
			requestBody: UpdateCurrentUserRequest{
				AvatarURL: strPtr("http://example.com/new_avatar.png"),
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest) {
				mock.ExpectExec("UPDATE users SET avatar_url = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs("http://example.com/new_avatar.png", testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1))
				rows := sqlmock.NewRows([]string{"id", "display_name", "email", "avatar_url", "role", "is_verified", "user_type", "classroom_code", "onboarding_complete", "selected_curriculum_id"}).
					AddRow(testUserID, "Old Name", "test@example.com", sql.NullString{String: "http://example.com/new_avatar.png", Valid: true}, "student", true, sql.NullString{}, sql.NullString{}, true, sql.NullString{})
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
			},
			expectedStatusCode:   http.StatusOK,
			expectUserResponse:   true,
			expectedDisplayName:  "Old Name",
			expectedAvatarURL:    "http://example.com/new_avatar.png",
		},
		{
			name: "successful name and avatar_url update",
			requestBody: UpdateCurrentUserRequest{
				DisplayName: strPtr("Updated Name Two"),
				AvatarURL:   strPtr("http://example.com/updated_avatar.png"),
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest) {
				// Order of fields in SET clause might vary, use Regexp if needed, or ensure consistent order in handler
				mock.ExpectExec("UPDATE users SET display_name = \\$1, avatar_url = \\$2, updated_at = NOW\\(\\) WHERE id = \\$3").
					WithArgs("Updated Name Two", "http://example.com/updated_avatar.png", testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1))
				rows := sqlmock.NewRows([]string{"id", "display_name", "email", "avatar_url", "role", "is_verified", "user_type", "classroom_code", "onboarding_complete", "selected_curriculum_id"}).
					AddRow(testUserID, "Updated Name Two", "test@example.com", sql.NullString{String: "http://example.com/updated_avatar.png", Valid: true}, "student", true, sql.NullString{}, sql.NullString{}, true, sql.NullString{})
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
			},
			expectedStatusCode:   http.StatusOK,
			expectUserResponse:   true,
			expectedDisplayName:  "Updated Name Two",
			expectedAvatarURL:    "http://example.com/updated_avatar.png",
		},
		{
			name:        "no fields provided for update",
			requestBody: UpdateCurrentUserRequest{}, // Both DisplayName and AvatarURL are nil
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest) {
				// No DB calls expected
			},
			expectedStatusCode: http.StatusBadRequest,
			expectUserResponse: false,
		},
		{
			name: "database error on update",
			requestBody: UpdateCurrentUserRequest{
				DisplayName: strPtr("Error Case Name"),
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurrentUserRequest) {
				mock.ExpectExec("UPDATE users SET display_name = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs("Error Case Name", testUserID).
					WillReturnError(sql.ErrConnDone) // Simulate a DB error
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectUserResponse: false,
		},
		// TODO: Add test case for when user ID from token is invalid/not found during the final SELECT (though authMiddleware should prevent this for the UPDATE itself).
		// This might manifest as an error from the SELECT query after a successful UPDATE if rowsAffected was 0 but not treated as an error.
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx := getTestGinContext(rr, testUserID) // Context with authenticated user ID

			// Set up request body
			jsonBody, _ := json.Marshal(tc.requestBody)
			ctx.Request, _ = http.NewRequest(http.MethodPut, "/api/v1/user/me", bytes.NewBuffer(jsonBody))
			ctx.Request.Header.Set("Content-Type", "application/json")

			// Set up DB mocks for this test case
			tc.mockDBExpectations(mock, tc.requestBody)

			// Call the handler
			app.handleUpdateCurrentUser(ctx)

			// Assertions
			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if tc.expectUserResponse {
				var responseUser CurrentUserResponse
				err := json.Unmarshal(rr.Body.Bytes(), &responseUser)
				assert.NoError(t, err, "Failed to unmarshal response body")
				assert.Equal(t, tc.expectedDisplayName, responseUser.DisplayName, "DisplayName in response does not match")

				// Handle sql.NullString for AvatarURL in CurrentUserResponse
				var responseAvatarURL string
				if responseUser.AvatarURL.Valid {
					responseAvatarURL = responseUser.AvatarURL.String
				}
				assert.Equal(t, tc.expectedAvatarURL, responseAvatarURL, "AvatarURL in response does not match")
				assert.Equal(t, testUserID, responseUser.ID, "User ID in response does not match")
			} else {
				// Optionally assert error message structure if applicable
				if rr.Code != http.StatusOK { // If expecting an error status
					var errorResponse map[string]string
					err := json.Unmarshal(rr.Body.Bytes(), &errorResponse)
					assert.NoError(t, err, "Failed to unmarshal error response body")
					assert.NotEmpty(t, errorResponse["error"], "Error message should be present in response")
				}
			}

			// Ensure all DB expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

// Helper to get pointer to string, useful for request structs with optional fields
func strPtr(s string) *string {
	return &s
}

// TODO: Add similar TestHandleRegister, TestHandleLogin, TestHandleGetCurrentUser etc.
// using the same pattern of sqlmock and httptest.
// Remember to also test authMiddleware separately or ensure its behavior is correctly mocked/accounted for.
// For example, tests for handleGetCurrentUser would also involve mocking the SELECT query.
// Tests for authMiddleware would check token validation, header parsing, etc.
// Test for other handlers like Onboarding, Curriculum update would follow similar patterns.
// Consider using a test suite structure (e.g. with testify/suite) for larger test files.
// Ensure Gin runs in TestMode (gin.SetMode(gin.TestMode)) for test runs.
// This is typically done in a TestMain or a setup function for the package.
func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	// Run tests
	m.Run()
}
