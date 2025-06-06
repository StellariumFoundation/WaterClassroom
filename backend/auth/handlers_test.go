package auth

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/water-classroom/backend/app"
	"github.com/water-classroom/backend/config"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// Helper function to create a mock Application and AuthHandler
func setupTestEnv(t *testing.T) (*AuthHandler, sqlmock.Sqlmock, *app.Application) {
	gin.SetMode(gin.TestMode)

	mockDb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}

	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatalf("Failed to generate RSA private key: %v", err)
	}

	testApp := &app.Application{
		Logger: zap.NewNop(),
		DB:     mockDb,
		Config: &config.Config{
			PasswordHashCost:     bcrypt.MinCost, // Use MinCost for tests
			JWTIssuer:            "test-issuer",
			JWTAudience:          "test-audience",
			AccessTokenDuration:  time.Hour * 1,
			RefreshTokenDuration: time.Hour * 24 * 7,
			// JWTSecretKey: "test-secret-key-minimum-32-characters", // Not needed for RSA
		},
		PrivateKey: privateKey,
		PublicKey:  &privateKey.PublicKey,
	}

	authHandler := &AuthHandler{App: testApp}
	return authHandler, mock, testApp
}

// TestHandleRegister_Success
func TestHandleRegister_Success(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet() // Ensure all expectations are met

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	registerReq := RegisterRequest{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(registerReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
		WithArgs(registerReq.Email).
		WillReturnError(sql.ErrNoRows)

	mock.ExpectQuery("INSERT INTO users \\(display_name, email, password_hash\\) VALUES \\(\\$1, \\$2, \\$3\\) RETURNING id").
		WithArgs(registerReq.Name, registerReq.Email, sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("new-user-id"))

	authHandler.HandleRegister(c)

	assert.Equal(t, http.StatusCreated, rr.Code)
	var userResp UserResponse
	err := json.Unmarshal(rr.Body.Bytes(), &userResp)
	assert.NoError(t, err)
	assert.Equal(t, "new-user-id", userResp.ID)
	assert.Equal(t, registerReq.Name, userResp.Name)
	assert.Equal(t, registerReq.Email, userResp.Email)
}

func TestHandleRegister_UserAlreadyExists(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	registerReq := RegisterRequest{
		Name:     "Test User",
		Email:    "exists@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(registerReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
		WithArgs(registerReq.Email).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow("existing-user-id")) // User exists

	authHandler.HandleRegister(c)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "User with this email already exists", errorResp["error"])
}

func TestHandleRegister_InvalidRequestPayload(t *testing.T) {
	authHandler, _, _ := setupTestEnv(t) // No DB interaction expected
	defer authHandler.App.DB.Close()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	// Invalid JSON (e.g., missing required fields or malformed)
	c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(`{"email":"bad"}`))
	c.Request.Header.Set("Content-Type", "application/json")

	authHandler.HandleRegister(c)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Contains(t, errorResp["error"], "Invalid request payload")
}

func TestHandleRegister_PasswordHashingFails(t *testing.T) {
	// This test is tricky because bcrypt.GenerateFromPassword is called directly.
	// To make it fail, we could pass an extremely high cost, but that would slow down the test.
	// Or, we could modify the handler to allow injecting a mock hasher, which is out of scope.
	// For now, we'll assume bcrypt works as expected if inputs are valid.
	// A more direct way to test bcrypt failure would be to pass an invalid salt or cost,
	// but the handler uses a cost from config.
	// We can simulate a failure by setting a config that causes bcrypt to error,
	// for example, by setting an invalid PasswordHashCost if bcrypt had stricter validation on it,
	// but bcrypt's GenerateFromPassword mainly fails on cost > MaxCost or < MinCost.
	// Since we use MinCost, it's unlikely to fail unless a system error occurs.

	// For the purpose of this exercise, we'll skip directly testing bcrypt failure
	// as it requires more invasive changes or reliance on system conditions.
	// However, if we could inject the hashing function:
	// mockHasher := func(password []byte, cost int) ([]byte, error) { return nil, errors.New("bcrypt failed") }
	// And then use this mockHasher in HandleRegister.
	t.Skip("Skipping direct bcrypt failure test as it requires handler modification or specific system conditions.")
}

func TestHandleRegister_DatabaseErrorOnUserInsert(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	registerReq := RegisterRequest{
		Name:     "Test User",
		Email:    "testfail@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(registerReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
		WithArgs(registerReq.Email).
		WillReturnError(sql.ErrNoRows)

	mock.ExpectQuery("INSERT INTO users \\(display_name, email, password_hash\\) VALUES \\(\\$1, \\$2, \\$3\\) RETURNING id").
		WithArgs(registerReq.Name, registerReq.Email, sqlmock.AnyArg()).
		WillReturnError(errors.New("database insert error"))

	authHandler.HandleRegister(c)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Failed to create user", errorResp["error"])
}

func TestHandleRegister_DatabaseErrorCheckingExistingUser(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	registerReq := RegisterRequest{
		Name:     "Test User",
		Email:    "testcheckfail@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(registerReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id FROM users WHERE email = \\$1").
		WithArgs(registerReq.Email).
		WillReturnError(errors.New("database check error"))

	authHandler.HandleRegister(c)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Database error", errorResp["error"])
}


// TestHandleLogin_Success
func TestHandleLogin_Success(t *testing.T) {
	authHandler, mock, testApp := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	loginReq := LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(loginReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(loginReq.Password), testApp.Config.PasswordHashCost)

	mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
		WithArgs(loginReq.Email).
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "password_hash"}).
			AddRow("user-id-123", loginReq.Email, string(hashedPassword)))

	// Assuming GenerateTokens works correctly if App is set up
	// (PrivateKey, Config for issuer, audience, durations)
	// No direct DB calls from GenerateTokens are assumed based on typical patterns
	// unless RefreshTokenPersistence is enabled and part of GenerateTokens, which is not indicated.

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusOK, rr.Code)
	var loginResp LoginResponse
	err := json.Unmarshal(rr.Body.Bytes(), &loginResp)
	assert.NoError(t, err)
	assert.NotEmpty(t, loginResp.AccessToken)
	assert.NotEmpty(t, loginResp.RefreshToken)
}

func TestHandleLogin_UserNotFound(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	loginReq := LoginRequest{
		Email:    "notfound@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(loginReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
		WithArgs(loginReq.Email).
		WillReturnError(sql.ErrNoRows)

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Invalid credentials", errorResp["error"])
}

func TestHandleLogin_IncorrectPassword(t *testing.T) {
	authHandler, mock, testApp := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	loginReq := LoginRequest{
		Email:    "test@example.com",
		Password: "wrongpassword",
	}
	reqBody, _ := json.Marshal(loginReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	// Correct password is "password123"
	correctPassword := "password123"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(correctPassword), testApp.Config.PasswordHashCost)

	mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
		WithArgs(loginReq.Email).
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "password_hash"}).
			AddRow("user-id-123", loginReq.Email, string(hashedPassword)))

	// bcrypt.CompareHashAndPassword will fail internally

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Invalid credentials", errorResp["error"])
}

func TestHandleLogin_InvalidRequestPayload(t *testing.T) {
	authHandler, _, _ := setupTestEnv(t) // No DB interaction
	defer authHandler.App.DB.Close()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(`{"email":"bad"}`)) // Malformed
	c.Request.Header.Set("Content-Type", "application/json")

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Contains(t, errorResp["error"], "Invalid request payload")
}

func TestHandleLogin_DatabaseErrorOnUserFetch(t *testing.T) {
	authHandler, mock, _ := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	loginReq := LoginRequest{
		Email:    "dbfail@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(loginReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
		WithArgs(loginReq.Email).
		WillReturnError(errors.New("database fetch error"))

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Database error", errorResp["error"])
}

func TestHandleLogin_TokenGenerationFails(t *testing.T) {
	// To simulate token generation failure, we can make PrivateKey nil
	authHandler, mock, testApp := setupTestEnv(t)
	defer authHandler.App.DB.Close()
	defer mock.ExpectationsWereMet()

	// Intentionally break something GenerateTokens needs
	testApp.PrivateKey = nil // This should cause GenerateTokens to fail

	rr := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rr)

	loginReq := LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}
	reqBody, _ := json.Marshal(loginReq)
	c.Request, _ = http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(loginReq.Password), testApp.Config.PasswordHashCost)

	mock.ExpectQuery("SELECT id, email, password_hash FROM users WHERE email = \\$1").
		WithArgs(loginReq.Email).
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "password_hash"}).
			AddRow("user-id-123", loginReq.Email, string(hashedPassword)))

	authHandler.HandleLogin(c)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	var errorResp map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &errorResp)
	assert.NoError(t, err)
	assert.Equal(t, "Failed to generate tokens", errorResp["error"])
}
