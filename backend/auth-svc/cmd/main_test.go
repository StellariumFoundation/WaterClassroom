package main

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"database/sql"
	"encoding/json"
	"fmt"
	"io" // Added for io.NopCloser
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock" // For mocking database interactions
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert" // For assertions
	"go.uber.org/zap"                   // For logger, if Application struct requires it
	"golang.org/x/crypto/bcrypt"
)

// Helper function to create a mock Application instance for testing
func setupTestApp(db *sql.DB) *Application {
	// For simplicity, using a Nop logger. In real tests, you might want a test logger.
	logger, _ := zap.NewDevelopment() // Or zap.NewNop()

	// Initialize a minimal config or use a mock config
	testConfig := &Config{
		JWTAccessTokenExpiry:  15 * time.Minute, // Default expiry for tokens generated in tests
		JWTRefreshTokenExpiry: 7 * 24 * time.Hour,
		JWTIssuer:             "test-issuer",
		JWTAudience:           "test-audience",
	}

	// Generate RSA keys for JWT
	privateKey, err := rsa.GenerateKey(rand.Reader, 512) // Use small key size for test speed
	if err != nil {
		panic(fmt.Sprintf("Failed to generate RSA private key for test: %v", err))
	}
	publicKey := &privateKey.PublicKey

	return &Application{
		DB:         db,
		Logger:     logger,
		Config:     testConfig,
		PrivateKey: privateKey,
		PublicKey:  publicKey,
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

// generateTestToken is a helper for creating JWTs for middleware tests
func generateTestToken(app *Application, userID string, lifetime time.Duration, includeSubClaim bool, customClaims jwt.MapClaims) (string, error) {
	claims := jwt.MapClaims{
		"aud": app.Config.JWTAudience,
		"iss": app.Config.JWTIssuer,
		"exp": time.Now().Add(lifetime).Unix(),
	}
	if includeSubClaim {
		claims["sub"] = userID
	}
	// Allow overriding or adding claims
	if customClaims != nil {
		for k, v := range customClaims {
			claims[k] = v
		}
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	if app.PrivateKey == nil {
		return "", fmt.Errorf("application private key is nil, cannot sign token")
	}
	return token.SignedString(app.PrivateKey)
}

func TestAuthMiddleware(t *testing.T) {
	// Setup a test app. DB can be nil if not directly used by middleware logic itself (which it isn't).
	// However, setupTestApp requires a db. So we pass a (potentially nil or mock) one.
	db, _, _ := sqlmock.New() // We don't need to check mock expectations here as DB is not used by middleware
	defer db.Close()
	app := setupTestApp(db)

	tests := []struct {
		name               string
		setupRequest       func(req *http.Request, app *Application) // To set headers, token etc.
		configModifier     func(cfg *Config)                         // To modify app config e.g. DisableAuth
		expectedStatusCode int
		expectedUserID     interface{} // string or nil
		expectNextCalled   bool
		expectedBodyJSON   gin.H // For error messages from the middleware
	}{
		{
			name: "successful authentication",
			setupRequest: func(req *http.Request, localApp *Application) {
				token, err := generateTestToken(localApp, "test-user-id", time.Minute*5, true, nil)
				assert.NoError(t, err)
				req.Header.Set("Authorization", "Bearer "+token)
			},
			expectedStatusCode: http.StatusOK, // Assuming test handler returns 200
			expectedUserID:     "test-user-id",
			expectNextCalled:   true,
		},
		{
			name:               "missing Authorization header",
			setupRequest:       func(req *http.Request, localApp *Application) {},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Authorization header is required"},
		},
		{
			name: "malformed Authorization header - no Bearer prefix",
			setupRequest: func(req *http.Request, localApp *Application) {
				req.Header.Set("Authorization", "Basic sometoken")
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Authorization header format must be Bearer {token}"},
		},
		{
			name: "malformed Authorization header - Bearer only",
			setupRequest: func(req *http.Request, localApp *Application) {
				req.Header.Set("Authorization", "Bearer")
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Authorization header format must be Bearer {token}"},
		},
		{
			name: "malformed Authorization header - Bearer token extra",
			setupRequest: func(req *http.Request, localApp *Application) {
				req.Header.Set("Authorization", "Bearer token extrapart")
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Authorization header format must be Bearer {token}"},
		},
		{
			name: "invalid token - bad signature",
			setupRequest: func(req *http.Request, localApp *Application) {
				// Create a token with a different private key
				otherPrivateKey, _ := rsa.GenerateKey(rand.Reader, 512)
				tempApp := *localApp // shallow copy
				tempApp.PrivateKey = otherPrivateKey
				token, err := generateTestToken(&tempApp, "test-user-id", time.Minute*5, true, nil)
				assert.NoError(t, err)
				req.Header.Set("Authorization", "Bearer "+token)
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Invalid or expired token"}, // Error from jwt.Parse
		},
		{
			name: "invalid token - malformed",
			setupRequest: func(req *http.Request, localApp *Application) {
				req.Header.Set("Authorization", "Bearer notavalidjwttoken")
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Invalid or expired token"},
		},
		{
			name: "expired token",
			setupRequest: func(req *http.Request, localApp *Application) {
				token, err := generateTestToken(localApp, "test-user-id", -time.Minute*5, true, nil) // Expired 5 mins ago
				assert.NoError(t, err)
				req.Header.Set("Authorization", "Bearer "+token)
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedUserID:     nil,
			expectNextCalled:   false,
			expectedBodyJSON:   gin.H{"error": "Invalid or expired token"},
		},
		{
			name: "token with missing sub claim",
			setupRequest: func(req *http.Request, localApp *Application) {
				token, err := generateTestToken(localApp, "test-user-id", time.Minute*5, false, nil) // includeSubClaim = false
				assert.NoError(t, err)
				req.Header.Set("Authorization", "Bearer "+token)
			},
			expectedStatusCode: http.StatusOK, // Middleware calls Next()
			expectedUserID:     nil,           // But userId is not set in context
			expectNextCalled:   true,
		},
		{
			name: "DisableAuth is true",
			setupRequest: func(req *http.Request, localApp *Application) {
				// No auth header needed
			},
			configModifier: func(cfg *Config) {
				cfg.DisableAuth = true
			},
			expectedStatusCode: http.StatusOK,
			expectedUserID:     nil, // No userId set by middleware when auth is disabled
			expectNextCalled:   true,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			// Reset DisableAuth for each test, then apply modifier if any
			app.Config.DisableAuth = false
			if tc.configModifier != nil {
				tc.configModifier(app.Config)
			}

			rr := httptest.NewRecorder()
			router := gin.New()
			var nextCalled bool
			var contextUserID interface{}

			router.Use(app.authMiddleware())
			router.GET("/test", func(c *gin.Context) {
				nextCalled = true
				contextUserID, _ = c.Get("userId")
				c.Status(http.StatusOK) // Send 200 if handler is reached
			})

			req, _ := http.NewRequest(http.MethodGet, "/test", nil)
			if tc.setupRequest != nil {
				tc.setupRequest(req, app)
			}

			router.ServeHTTP(rr, req)

			assert.Equal(t, tc.expectedStatusCode, rr.Code, "HTTP status code mismatch")
			assert.Equal(t, tc.expectNextCalled, nextCalled, "Next handler called state mismatch")

			if tc.expectNextCalled {
				assert.Equal(t, tc.expectedUserID, contextUserID, "User ID in context mismatch")
			}

			if len(tc.expectedBodyJSON) > 0 {
				var actualBody gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &actualBody)
				assert.NoError(t, err, "Failed to unmarshal error response body")
				assert.Equal(t, tc.expectedBodyJSON, actualBody, "Error JSON response mismatch")
			}
			
			// Restore DisableAuth to default after test
			app.Config.DisableAuth = false
		})
	}
}

func TestHandleDeleteAccount(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	const testUserID = "user-delete-test-id"

	tests := []struct {
		name               string
		setupContext       func(c *gin.Context)
		mockDBExpectations func(mock sqlmock.Sqlmock)
		expectedStatusCode int
		expectedResponse   gin.H
	}{
		{
			name:         "successful account deletion",
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectExec("DELETE FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1)) // 1 row affected
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   gin.H{"message": "Account deleted successfully"},
		},
		{
			name:               "user ID not in context",
			setupContext:       func(c *gin.Context) { /* No userId */ },
			mockDBExpectations: nil, // No DB call expected
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "User ID not found in token"},
		},
		{
			name:         "database error on deletion",
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectExec("DELETE FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to delete account"},
		},
		{
			name:         "user not found (0 rows affected on delete)",
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectExec("DELETE FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnResult(sqlmock.NewResult(0, 0)) // 0 rows affected
			},
			expectedStatusCode: http.StatusNotFound,
			expectedResponse:   gin.H{"error": "User not found for deletion"},
		},
		{
			name:               "invalid User ID format in context",
			setupContext:       func(c *gin.Context) { c.Set("userId", 12345) }, // Invalid type
			mockDBExpectations: nil,                                             // No DB call expected
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Invalid User ID format in token"},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr)
			// DELETE method for deleting a resource
			ctx.Request, _ = http.NewRequest(http.MethodDelete, "/api/v1/user/me", nil)

			if tc.setupContext != nil {
				tc.setupContext(ctx)
			}

			if tc.mockDBExpectations != nil {
				tc.mockDBExpectations(mock)
			}

			app.handleDeleteAccount(ctx)

			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if len(tc.expectedResponse) > 0 {
				var actualResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedResponse, actualResponse)
			}

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestHandleChangePassword(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	app.Config.PasswordHashCost = bcrypt.MinCost // Use minimum cost for faster tests
	const testUserID = "user-changepw-test-id"

	oldPassword := "oldPassword123"
	newPassword := "newPassword456"
	hashedOldPassword, _ := bcrypt.GenerateFromPassword([]byte(oldPassword), app.Config.PasswordHashCost)
	// Note: newHashedPassword is not generated here as the handler does it. We only need to mock its storage.

	tests := []struct {
		name               string
		requestBody        interface{}
		setupContext       func(c *gin.Context)
		mockDBExpectations func(mock sqlmock.Sqlmock)
		expectedStatusCode int
		expectedResponse   gin.H
	}{
		{
			name: "successful password change",
			requestBody: ChangePasswordRequest{
				OldPassword: oldPassword,
				NewPassword: newPassword,
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				// Expect query for current password hash
				rows := sqlmock.NewRows([]string{"password_hash"}).AddRow(string(hashedOldPassword))
				mock.ExpectQuery("SELECT password_hash FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
				// Expect update for new password hash
				mock.ExpectExec("UPDATE users SET password_hash = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs(sqlmock.AnyArg(), testUserID). // sqlmock.AnyArg() for the newly hashed password
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   gin.H{"message": "Password changed successfully"},
		},
		{
			name: "incorrect old password",
			requestBody: ChangePasswordRequest{
				OldPassword: "wrongOldPassword",
				NewPassword: newPassword,
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				rows := sqlmock.NewRows([]string{"password_hash"}).AddRow(string(hashedOldPassword))
				mock.ExpectQuery("SELECT password_hash FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
				// No update expected
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "Incorrect old password"},
		},
		{
			name:        "user not found when fetching old password",
			requestBody: ChangePasswordRequest{OldPassword: oldPassword, NewPassword: newPassword},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectQuery("SELECT password_hash FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnError(sql.ErrNoRows)
			},
			expectedStatusCode: http.StatusNotFound,
			expectedResponse:   gin.H{"error": "User not found"},
		},
		{
			name:        "DB error when fetching old password",
			requestBody: ChangePasswordRequest{OldPassword: oldPassword, NewPassword: newPassword},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectQuery("SELECT password_hash FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Database error fetching user details"},
		},
		{
			name: "DB error when updating new password",
			requestBody: ChangePasswordRequest{
				OldPassword: oldPassword,
				NewPassword: newPassword,
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				rows := sqlmock.NewRows([]string{"password_hash"}).AddRow(string(hashedOldPassword))
				mock.ExpectQuery("SELECT password_hash FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
				mock.ExpectExec("UPDATE users SET password_hash = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs(sqlmock.AnyArg(), testUserID).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to update password"},
		},
		{
			name:               "invalid request payload - missing new_password",
			requestBody:        gin.H{"old_password": oldPassword},
			setupContext:       func(c *gin.Context) { c.Set("userId", testUserID) },
			expectedStatusCode: http.StatusBadRequest,
			// Error message detail is handled by Gin validator, check presence of "error"
		},
		{
			name: "invalid request payload - new_password too short",
			requestBody: ChangePasswordRequest{
				OldPassword: oldPassword,
				NewPassword: "short", // Less than 8 chars
			},
			setupContext:       func(c *gin.Context) { c.Set("userId", testUserID) },
			expectedStatusCode: http.StatusBadRequest,
		},
		{
			name:               "user ID not in context",
			requestBody:        ChangePasswordRequest{OldPassword: oldPassword, NewPassword: newPassword},
			setupContext:       func(c *gin.Context) { /* No userId */ },
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "User ID not found in token"},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr)
			// The route for handleChangePassword is /api/v1/user/change-password
			// It's a PUT or POST, typically POST for actions like this. Let's assume POST.
			// The handler was added to `protected.POST("/change-password", app.handleChangePassword)`
			ctx.Request, _ = http.NewRequest(http.MethodPost, "/api/v1/user/change-password", nil)
			ctx.Request.Header.Set("Content-Type", "application/json")

			if tc.setupContext != nil {
				tc.setupContext(ctx)
			}

			if tc.requestBody != nil {
				reqBodyBytes, _ := json.Marshal(tc.requestBody)
				ctx.Request.Body = io.NopCloser(bytes.NewBuffer(reqBodyBytes))
			}

			if tc.mockDBExpectations != nil {
				tc.mockDBExpectations(mock)
			}

			app.handleChangePassword(ctx)

			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if len(tc.expectedResponse) > 0 {
				var actualResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedResponse, actualResponse)
			} else if tc.expectedStatusCode == http.StatusBadRequest {
                 var actualResponse gin.H
                 err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
                 assert.NoError(t, err, "Failed to unmarshal error response for bad request")
                 assert.NotEmpty(t, actualResponse["error"], "Expected error message for bad request")
            }


			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestHandleUpdateOnboardingDetails(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	const testUserID = "user-onboarding-test-id"

	tests := []struct {
		name               string
		requestBody        interface{} // Using interface{} to allow for invalid payloads too
		setupContext       func(c *gin.Context)
		mockDBExpectations func(mock sqlmock.Sqlmock, reqBody OnboardingDetailsRequest)
		expectedStatusCode int
		expectedResponse   gin.H
	}{
		{
			name: "successful update with classroom code",
			requestBody: OnboardingDetailsRequest{
				UserType:      "school_student",
				ClassroomCode: "CLASS101",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody OnboardingDetailsRequest) {
				mock.ExpectExec("UPDATE users SET user_type = \\$1, classroom_code = \\$2, onboarding_complete = TRUE, updated_at = NOW\\(\\) WHERE id = \\$3").
					WithArgs(reqBody.UserType, reqBody.ClassroomCode, testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   gin.H{"message": "Onboarding details updated successfully"},
		},
		{
			name: "successful update with empty classroom code",
			requestBody: OnboardingDetailsRequest{
				UserType: "homeschool",
				// ClassroomCode is empty, should be treated as NULL
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody OnboardingDetailsRequest) {
				mock.ExpectExec("UPDATE users SET user_type = \\$1, classroom_code = \\$2, onboarding_complete = TRUE, updated_at = NOW\\(\\) WHERE id = \\$3").
					WithArgs(reqBody.UserType, nil, testUserID). // Expecting nil for classroom_code
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   gin.H{"message": "Onboarding details updated successfully"},
		},
		{
			name:               "user ID not in context",
			requestBody:        OnboardingDetailsRequest{UserType: "individual"},
			setupContext:       func(c *gin.Context) { /* No userId */ },
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "User ID not found in token"},
		},
		{
			name:               "invalid User ID format",
			requestBody:        OnboardingDetailsRequest{UserType: "individual"},
			setupContext:       func(c *gin.Context) { c.Set("userId", 123) },
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Invalid User ID format in token"},
		},
		{
			name:               "invalid request payload - missing user_type",
			requestBody:        gin.H{"classroom_code": "CLASS102"}, // UserType is missing
			setupContext:       func(c *gin.Context) { c.Set("userId", testUserID) },
			expectedStatusCode: http.StatusBadRequest,
			// Specific error message depends on Gin binding errors, so we check for the status and presence of "error"
		},
		{
			name: "database error on update",
			requestBody: OnboardingDetailsRequest{
				UserType: "individual",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody OnboardingDetailsRequest) {
				mock.ExpectExec("UPDATE users SET user_type = \\$1, classroom_code = \\$2, onboarding_complete = TRUE, updated_at = NOW\\(\\) WHERE id = \\$3").
					WithArgs(reqBody.UserType, nil, testUserID).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to update onboarding details"},
		},
		{
			name: "user not found (0 rows affected)",
			requestBody: OnboardingDetailsRequest{
				UserType: "individual",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody OnboardingDetailsRequest) {
				mock.ExpectExec("UPDATE users SET user_type = \\$1, classroom_code = \\$2, onboarding_complete = TRUE, updated_at = NOW\\(\\) WHERE id = \\$3").
					WithArgs(reqBody.UserType, nil, testUserID).
					WillReturnResult(sqlmock.NewResult(0, 0)) // 0 rows affected
			},
			expectedStatusCode: http.StatusNotFound,
			expectedResponse:   gin.H{"error": "User not found"},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr)
			ctx.Request, _ = http.NewRequest(http.MethodPut, "/api/v1/user/onboarding-details", nil)
			ctx.Request.Header.Set("Content-Type", "application/json")

			if tc.setupContext != nil {
				tc.setupContext(ctx)
			}

			// Marshal request body
			var reqBodyBytes []byte
			if tc.requestBody != nil {
				reqBodyBytes, _ = json.Marshal(tc.requestBody)
				ctx.Request.Body = io.NopCloser(bytes.NewBuffer(reqBodyBytes))
			}

			if tc.mockDBExpectations != nil {
				// Need to handle cases where requestBody might not be OnboardingDetailsRequest for invalid payload tests
				if validReq, ok := tc.requestBody.(OnboardingDetailsRequest); ok {
					tc.mockDBExpectations(mock, validReq)
				} else {
					// For tests like "invalid request payload", mockDBExpectations might be nil or need specific handling
					// if any DB interaction is still expected (usually not for pure binding errors).
					// If mockDBExpectations is defined for an invalid payload struct, it might panic.
					// Current structure assumes mockDBExpectations is nil for such cases or the test is specific.
				}
			}

			app.handleUpdateOnboardingDetails(ctx)

			assert.Equal(t, tc.expectedStatusCode, rr.Code)
			if len(tc.expectedResponse) > 0 {
				var actualResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err)
				// For binding errors, the exact message from Gin can be long and vary.
				// So, if we expect a bad request and an error message is provided in tc.expectedResponse,
				// we check if the actual error contains the expected substring.
				if tc.expectedStatusCode == http.StatusBadRequest && tc.expectedResponse["error"] == nil {
                     assert.NotEmpty(t, actualResponse["error"], "Expected error message for bad request")
                } else {
					assert.Equal(t, tc.expectedResponse, actualResponse)
				}
			}

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestHandleUpdateUserCurriculum(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	const testUserID = "user-curriculum-test-id"

	tests := []struct {
		name               string
		requestBody        interface{}
		setupContext       func(c *gin.Context)
		mockDBExpectations func(mock sqlmock.Sqlmock, reqBody UpdateCurriculumRequest)
		expectedStatusCode int
		expectedResponse   gin.H
	}{
		{
			name: "successful update",
			requestBody: UpdateCurriculumRequest{
				SelectedCurriculumID: "curr-abc-123",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurriculumRequest) {
				mock.ExpectExec("UPDATE users SET selected_curriculum_id = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs(reqBody.SelectedCurriculumID, testUserID).
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   gin.H{"message": "User curriculum updated successfully"},
		},
		{
			name:               "user ID not in context",
			requestBody:        UpdateCurriculumRequest{SelectedCurriculumID: "curr-abc-123"},
			setupContext:       func(c *gin.Context) { /* No userId */ },
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "User ID not found in token"},
		},
		{
			name:               "invalid User ID format",
			requestBody:        UpdateCurriculumRequest{SelectedCurriculumID: "curr-abc-123"},
			setupContext:       func(c *gin.Context) { c.Set("userId", 123) },
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Invalid User ID format in token"},
		},
		{
			name:               "invalid request payload - missing curriculum_id",
			requestBody:        gin.H{}, // SelectedCurriculumID is missing
			setupContext:       func(c *gin.Context) { c.Set("userId", testUserID) },
			expectedStatusCode: http.StatusBadRequest,
		},
		{
			name: "database error on update",
			requestBody: UpdateCurriculumRequest{
				SelectedCurriculumID: "curr-xyz-789",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurriculumRequest) {
				mock.ExpectExec("UPDATE users SET selected_curriculum_id = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs(reqBody.SelectedCurriculumID, testUserID).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to update curriculum selection"},
		},
		{
			name: "user not found (0 rows affected)",
			requestBody: UpdateCurriculumRequest{
				SelectedCurriculumID: "curr-def-456",
			},
			setupContext: func(c *gin.Context) { c.Set("userId", testUserID) },
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody UpdateCurriculumRequest) {
				mock.ExpectExec("UPDATE users SET selected_curriculum_id = \\$1, updated_at = NOW\\(\\) WHERE id = \\$2").
					WithArgs(reqBody.SelectedCurriculumID, testUserID).
					WillReturnResult(sqlmock.NewResult(0, 0)) // 0 rows affected
			},
			expectedStatusCode: http.StatusNotFound,
			expectedResponse:   gin.H{"error": "User not found"},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr)
			ctx.Request, _ = http.NewRequest(http.MethodPut, "/api/v1/user/curriculum", nil) // Path for curriculum
			ctx.Request.Header.Set("Content-Type", "application/json")

			if tc.setupContext != nil {
				tc.setupContext(ctx)
			}

			var reqBodyBytes []byte
			if tc.requestBody != nil {
				reqBodyBytes, _ = json.Marshal(tc.requestBody)
				ctx.Request.Body = io.NopCloser(bytes.NewBuffer(reqBodyBytes))
			}

			if tc.mockDBExpectations != nil {
				if validReq, ok := tc.requestBody.(UpdateCurriculumRequest); ok {
					tc.mockDBExpectations(mock, validReq)
				}
			}

			app.handleUpdateUserCurriculum(ctx)

			assert.Equal(t, tc.expectedStatusCode, rr.Code)
			if len(tc.expectedResponse) > 0 {
				var actualResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err)
                if tc.expectedStatusCode == http.StatusBadRequest && tc.expectedResponse["error"] == nil {
                     assert.NotEmpty(t, actualResponse["error"], "Expected error message for bad request")
                } else {
					assert.Equal(t, tc.expectedResponse, actualResponse)
				}
			}
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestHandleLogin(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	app.Config.PasswordHashCost = bcrypt.MinCost // Use minimum cost for faster tests

	// Generate a dummy RSA private key for token signing in tests
	dummyPrivateKey, err := rsa.GenerateKey(rand.Reader, 512) // Using 512 for speed; real keys should be larger
	if err != nil {
		t.Fatalf("Failed to generate dummy RSA private key: %v", err)
	}
	app.PrivateKey = dummyPrivateKey // Set it for the app instance

	validPassword := "password123"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(validPassword), app.Config.PasswordHashCost)

	tests := []struct {
		name                 string
		requestBody          LoginRequest
		mockDBExpectations   func(mock sqlmock.Sqlmock, reqBody LoginRequest)
		preHandlerHook       func(app *Application) // To modify app state, e.g., break PrivateKey
		postHandlerHook      func(app *Application) // To restore app state
		expectedStatusCode   int
		expectedResponseKeys []string // For successful login, check for token keys
		expectedErrorMsg     string   // For error responses
	}{
		{
			name: "successful login",
			requestBody: LoginRequest{
				Email:    "test@example.com",
				Password: validPassword,
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody LoginRequest) {
				rows := sqlmock.NewRows([]string{"id", "email", "password_hash"}).
					AddRow("user-id-1", reqBody.Email, string(hashedPassword))
				mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnRows(rows)
			},
			// For a truly successful login, app.PrivateKey needs to be valid.
			// We assume setupTestApp or a TestMain would handle initial key parsing for the app instance.
			// If generateTokens is robustly unit-tested separately, here we mostly care about its invocation.
			preHandlerHook: func(app *Application) {
				// Ensure a valid (dummy) private key is set for this test case,
				// assuming it's not nil from setupTestApp.
				// This is tricky without a proper RSA key generation in test.
				// The current main.go's parseJWTKeys reads from config.
				// For now, we'll rely on generateTokens not erroring out if PrivateKey is not nil.
				// A better approach: mock generateTokens itself.
				// For this test, we will assume PrivateKey is valid from app setup.
				// To test the token generation *error*, we explicitly set PrivateKey to nil.
			},
			expectedStatusCode:   http.StatusOK,
			expectedResponseKeys: []string{"access_token", "refresh_token"},
		},
		{
			name: "user not found",
			requestBody: LoginRequest{
				Email:    "nonexistent@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody LoginRequest) {
				mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnError(sql.ErrNoRows)
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedErrorMsg:   "Invalid credentials",
		},
		{
			name: "incorrect password",
			requestBody: LoginRequest{
				Email:    "test@example.com",
				Password: "wrongpassword",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody LoginRequest) {
				rows := sqlmock.NewRows([]string{"id", "email", "password_hash"}).
					AddRow("user-id-1", reqBody.Email, string(hashedPassword)) // Correct hash for 'password123'
				mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnRows(rows)
			},
			expectedStatusCode: http.StatusUnauthorized,
			expectedErrorMsg:   "Invalid credentials",
		},
		{
			name: "database error on querying user",
			requestBody: LoginRequest{
				Email:    "test@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody LoginRequest) {
				mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnError(sql.ErrConnDone)
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedErrorMsg:   "Database error",
		},
		{
			name: "token generation error due to nil private key",
			requestBody: LoginRequest{
				Email:    "test@example.com",
				Password: validPassword,
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody LoginRequest) {
				rows := sqlmock.NewRows([]string{"id", "email", "password_hash"}).
					AddRow("user-id-1", reqBody.Email, string(hashedPassword))
				mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnRows(rows)
			},
			preHandlerHook: func(app *Application) {
				app.PrivateKey = nil // Intentionally break private key
			},
			postHandlerHook: func(app *Application) {
				// Restore private key if it was globally set in a TestMain or similar
				// For this test, we assume setupTestApp provides a fresh app each time or keys are not vital globally.
				// If parseJWTKeys was called by setupTestApp, this might not be needed or might need proper restoration.
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedErrorMsg:   "Failed to generate tokens",
		},
		{
			name: "invalid request payload - missing email",
			requestBody: LoginRequest{
				Password: "password123",
			},
			expectedStatusCode: http.StatusBadRequest,
			// Error message check can be loose for binding errors
		},
		{
			name: "invalid request payload - invalid email format",
			requestBody: LoginRequest{
				Email:    "not-an-email",
				Password: "password123",
			},
			expectedStatusCode: http.StatusBadRequest,
		},
		{
			name: "invalid request payload - missing password",
			requestBody: LoginRequest{
				Email: "test@example.com",
			},
			expectedStatusCode: http.StatusBadRequest,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr)

			jsonBody, _ := json.Marshal(tc.requestBody)
			ctx.Request, _ = http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
			ctx.Request.Header.Set("Content-Type", "application/json")

			if tc.mockDBExpectations != nil {
				tc.mockDBExpectations(mock, tc.requestBody)
			}

			originalPrivateKey := app.PrivateKey // Save original key
			if tc.preHandlerHook != nil {
				tc.preHandlerHook(app)
			}

			app.handleLogin(ctx)

			if tc.postHandlerHook != nil {
				tc.postHandlerHook(app)
			}
			app.PrivateKey = originalPrivateKey // Restore original key

			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if tc.expectedStatusCode == http.StatusOK {
				var responseBody map[string]string
				err := json.Unmarshal(rr.Body.Bytes(), &responseBody)
				assert.NoError(t, err)
				for _, key := range tc.expectedResponseKeys {
					assert.NotEmpty(t, responseBody[key], "Expected key %s to be present and non-empty", key)
				}
			} else if tc.expectedErrorMsg != "" {
				var errorResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &errorResponse)
				assert.NoError(t, err)
				assert.Contains(t, errorResponse["error"], tc.expectedErrorMsg, "Error message mismatch")
			} else if rr.Code == http.StatusBadRequest {
				// For binding errors, just check there is an error message
				var errorResponse gin.H
				err := json.Unmarshal(rr.Body.Bytes(), &errorResponse)
				assert.NoError(t, err)
				assert.NotEmpty(t, errorResponse["error"], "Expected error message for bad request")
			}

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

func TestHandleRegister(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db) // Create a test app instance with the mock DB
	app.Config.PasswordHashCost = bcrypt.MinCost // Use minimum cost for faster tests

	tests := []struct {
		name               string
		requestBody        RegisterRequest
		mockDBExpectations func(mock sqlmock.Sqlmock, reqBody RegisterRequest)
		expectedStatusCode int
		expectedResponse   interface{} // Can be UserResponse or gin.H for errors
	}{
		{
			name: "successful registration",
			requestBody: RegisterRequest{
				Name:     "Test User",
				Email:    "test@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// Expect query to check if user exists (and return no rows)
				mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnError(sql.ErrNoRows)

				// Expect insert query for new user
				newUserID := "new-user-id"
				mock.ExpectQuery("INSERT INTO users \\(display_name, email, password_hash\\) VALUES \\(\\$1, \\$2, \\$3\\) RETURNING id").
					WithArgs(reqBody.Name, reqBody.Email, sqlmock.AnyArg()). // sqlmock.AnyArg() for hashed password
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(newUserID))
			},
			expectedStatusCode: http.StatusCreated,
			expectedResponse: UserResponse{
				ID:    "new-user-id",
				Name:  "Test User",
				Email: "test@example.com",
			},
		},
		{
			name: "user already exists",
			requestBody: RegisterRequest{
				Name:     "Existing User",
				Email:    "existing@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// Expect query to check if user exists (and return an existing ID)
				mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("existing-user-id"))
			},
			expectedStatusCode: http.StatusBadRequest,
			expectedResponse:   gin.H{"error": "User with this email already exists"},
		},
		{
			name: "database error on checking user existence",
			requestBody: RegisterRequest{
				Name:     "DB Error User",
				Email:    "dberror@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// Expect query to check if user exists (and return a DB error)
				mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnError(sql.ErrConnDone) // Simulate a connection error
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Database error"},
		},
		{
			name: "database error on inserting new user",
			requestBody: RegisterRequest{
				Name:     "Insert Error User",
				Email:    "inserterror@example.com",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// Expect query to check if user exists (and return no rows)
				mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
					WithArgs(reqBody.Email).
					WillReturnError(sql.ErrNoRows)

				// Expect insert query for new user (and return a DB error)
				mock.ExpectQuery("INSERT INTO users \\(display_name, email, password_hash\\) VALUES \\(\\$1, \\$2, \\$3\\) RETURNING id").
					WithArgs(reqBody.Name, reqBody.Email, sqlmock.AnyArg()).
					WillReturnError(sql.ErrConnDone) // Simulate a connection error
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to create user"},
		},
		{
			name: "invalid request payload - missing email",
			requestBody: RegisterRequest{
				Name:     "Test User",
				Password: "password123",
				// Email is missing
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// No DB calls expected
			},
			expectedStatusCode: http.StatusBadRequest,
			// The specific error message from Gin binding can be complex, so we check for non-empty error
		},
		{
			name: "invalid request payload - invalid email format",
			requestBody: RegisterRequest{
				Name:     "Test User",
				Email:    "not-an-email",
				Password: "password123",
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// No DB calls expected
			},
			expectedStatusCode: http.StatusBadRequest,
		},
		{
			name: "invalid request payload - short password",
			requestBody: RegisterRequest{
				Name:     "Test User",
				Email:    "test@example.com",
				Password: "short", // Less than 8 characters
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock, reqBody RegisterRequest) {
				// No DB calls expected
			},
			expectedStatusCode: http.StatusBadRequest,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr) // Create a fresh context for public routes

			// Set up request body
			jsonBody, _ := json.Marshal(tc.requestBody)
			ctx.Request, _ = http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			ctx.Request.Header.Set("Content-Type", "application/json")

			// Set up DB mocks for this test case
			if tc.mockDBExpectations != nil {
				tc.mockDBExpectations(mock, tc.requestBody)
			}

			// Call the handler
			app.handleRegister(ctx)

			// Assertions
			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if rr.Code == http.StatusCreated {
				var responseUser UserResponse
				err := json.Unmarshal(rr.Body.Bytes(), &responseUser)
				assert.NoError(t, err, "Failed to unmarshal UserResponse body")
				expectedUserResponse := tc.expectedResponse.(UserResponse)
				assert.Equal(t, expectedUserResponse.ID, responseUser.ID)
				assert.Equal(t, expectedUserResponse.Name, responseUser.Name)
				assert.Equal(t, expectedUserResponse.Email, responseUser.Email)
			} else if tc.expectedResponse != nil {
				// For error responses or other specific JSON structures
				expectedRespBytes, _ := json.Marshal(tc.expectedResponse)
				assert.JSONEq(t, string(expectedRespBytes), rr.Body.String(), "Error response body does not match")
			}


			// Ensure all DB expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
} // Close TestHandleRegister

func TestHandleGetCurrentUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	app := setupTestApp(db)
	const testUserID = "user-test-id-getme"

	fullUserRow := CurrentUserResponse{
		ID:                 testUserID,
		DisplayName:        "Test User GetMe",
		Email:              "getme@example.com",
		AvatarURL:          sql.NullString{String: "http://example.com/avatar.png", Valid: true},
		Role:               "student",
		IsVerified:         true,
		UserType:           sql.NullString{String: "individual", Valid: true},
		ClassroomCode:      sql.NullString{Valid: false}, // Null classroom code
		OnboardingComplete: true,
		SelectedCurriculumID: sql.NullString{String: "curriculum-123", Valid: true},
	}

	tests := []struct {
		name               string
		setupContext       func(c *gin.Context) // To manipulate context for specific tests
		mockDBExpectations func(mock sqlmock.Sqlmock)
		expectedStatusCode int
		expectedResponse   interface{} // Can be CurrentUserResponse or gin.H
	}{
		{
			name: "successful fetch",
			setupContext: func(c *gin.Context) {
				c.Set("userId", testUserID)
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				rows := sqlmock.NewRows([]string{"id", "display_name", "email", "avatar_url", "role", "is_verified", "user_type", "classroom_code", "onboarding_complete", "selected_curriculum_id"}).
					AddRow(fullUserRow.ID, fullUserRow.DisplayName, fullUserRow.Email, fullUserRow.AvatarURL, fullUserRow.Role, fullUserRow.IsVerified, fullUserRow.UserType, fullUserRow.ClassroomCode, fullUserRow.OnboardingComplete, fullUserRow.SelectedCurriculumID)
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnRows(rows)
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   fullUserRow,
		},
		{
			name: "user ID not in context",
			setupContext: func(c *gin.Context) {
				// Do not set userId
			},
			mockDBExpectations: nil, // No DB call expected
			expectedStatusCode: http.StatusUnauthorized,
			expectedResponse:   gin.H{"error": "User ID not found in token"},
		},
		{
			name: "invalid User ID format in context",
			setupContext: func(c *gin.Context) {
				c.Set("userId", 12345) // Set userId as an int
			},
			mockDBExpectations: nil, // No DB call expected
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Invalid User ID format in token"},
		},
		{
			name: "user not found in database",
			setupContext: func(c *gin.Context) {
				c.Set("userId", testUserID)
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnError(sql.ErrNoRows)
			},
			expectedStatusCode: http.StatusNotFound,
			expectedResponse:   gin.H{"error": "User not found"},
		},
		{
			name: "database error on fetching user",
			setupContext: func(c *gin.Context) {
				c.Set("userId", testUserID)
			},
			mockDBExpectations: func(mock sqlmock.Sqlmock) {
				mock.ExpectQuery("SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id FROM users WHERE id = \\$1").
					WithArgs(testUserID).
					WillReturnError(sql.ErrConnDone) // Simulate a connection error
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedResponse:   gin.H{"error": "Failed to fetch user details"},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(rr) // Create a fresh context
			ctx.Request, _ = http.NewRequest(http.MethodGet, "/api/v1/user/me", nil)

			if tc.setupContext != nil {
				tc.setupContext(ctx)
			}

			if tc.mockDBExpectations != nil {
				tc.mockDBExpectations(mock)
			}

			app.handleGetCurrentUser(ctx)

			assert.Equal(t, tc.expectedStatusCode, rr.Code)

			if tc.expectedResponse != nil {
				if respUser, ok := tc.expectedResponse.(CurrentUserResponse); ok {
					var actualResponse CurrentUserResponse
					err := json.Unmarshal(rr.Body.Bytes(), &actualResponse)
					assert.NoError(t, err)
					assert.Equal(t, respUser, actualResponse)
				} else if respError, ok := tc.expectedResponse.(gin.H); ok {
					var actualError gin.H
					err := json.Unmarshal(rr.Body.Bytes(), &actualError)
					assert.NoError(t, err)
					assert.Equal(t, respError, actualError)
				}
			}

			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}
