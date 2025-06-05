package auth

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/StellariumFoundation/WaterClassroom/backend/internal/app"
	"github.com/StellariumFoundation/WaterClassroom/backend/internal/config"
	"github.com/StellariumFoundation/WaterClassroom/backend/internal/router"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// testJWTPrivateKeyPKCS1 uses \\n for newlines as ParseJWTKeys expects this format.
// This is a minimal, valid PKCS#1 RSA private key for testing purposes.
const testJWTPrivateKeyPKCS1 = "-----BEGIN RSA PRIVATE KEY-----\\n" +
	"MC4CAQACBQD2Tr1dAgMBAAECBQDm4c7BAgMA/asCAwD9qwIDAP2rAgMA/asC\\n" +
	"-----END RSA PRIVATE KEY-----"

// testJWTPublicKey uses \\n for newlines.
// This is the corresponding public key.
const testJWTPublicKey = "-----BEGIN PUBLIC KEY-----\\n" +
	"MCwwDQYJKoZIhvcNAQEBBQADGwAwGAIRAPZOvV0CAwD9qwIBAQNz\\n" +
	"-----END PUBLIC KEY-----"

// applyMigrations reads .sql files from a directory and executes them on the db.
// It sorts files by name before execution.
func applyMigrations(t *testing.T, db *sql.DB, migrationDir string) {
	t.Helper()
	var migrationFiles []string

	err := filepath.WalkDir(migrationDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && strings.HasSuffix(d.Name(), ".sql") {
			// Only include files directly in migrationDir, not subdirectories
			if filepath.Dir(path) == migrationDir {
				migrationFiles = append(migrationFiles, path)
			}
		}
		return nil
	})
	require.NoError(t, err, "Error walking migration directory: %s. Ensure path is correct relative to test execution.", migrationDir)

	sort.Strings(migrationFiles) // Ensure migrations are applied in order

	t.Logf("Found %d migration files in %s", len(migrationFiles), migrationDir)

	appliedCount := 0
	for _, mfPath := range migrationFiles {
		fileName := filepath.Base(mfPath)
		if strings.HasPrefix(fileName, "001_") ||
			strings.HasPrefix(fileName, "002_") ||
			strings.HasPrefix(fileName, "003_") ||
			strings.HasPrefix(fileName, "004_") {

			t.Logf("Applying migration: %s", mfPath)
			content, err := os.ReadFile(mfPath)
			require.NoError(t, err, fmt.Sprintf("Error reading migration file: %s", mfPath))

			_, err = db.Exec(string(content))
			require.NoError(t, err, fmt.Sprintf("Error executing migration file: %s. SQL: %s", mfPath, string(content)))
			appliedCount++
		}
	}
	require.True(t, appliedCount >= 1, "Expected at least 001_auth_initial_schema.sql to be applied")
	t.Logf("Applied %d migrations successfully.", appliedCount)
}

func setupIntegrationTest(t *testing.T) (*app.Application, *gin.Engine, *sql.DB) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	// Generate a unique database name for each test run to avoid conflicts
	// and ensure a clean state if not purely in-memory or if cache=shared behaves unexpectedly.
	dbSourceName := fmt.Sprintf("file:%s_%d_integration_test.db?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"), time.Now().UnixNano())
	t.Logf("Using database source: %s", dbSourceName)


	cfg := &config.Config{
		LogLevel: "debug", // Use debug for more verbose logs during testing
		Env:      "test",
		DBDriver: "sqlite3",
		DBSource: dbSourceName,
		PasswordHashCost: bcrypt.MinCost,
		JWTIssuer: "test-issuer",
		JWTAudience: "test-audience",
		JWTPrivateKey: testJWTPrivateKeyPKCS1,
		JWTPublicKey: testJWTPublicKey,
		JWTAccessTokenExpiry:  time.Hour,
		JWTRefreshTokenExpiry: time.Hour * 24,
		DisableAuth: false,
	}

	logger, err := zap.NewDevelopment(zap.IncreaseLevel(zap.DebugLevel)) // Capture debug logs
	require.NoError(t, err)
	t.Cleanup(func() { logger.Sync() })


	db, err := sql.Open(cfg.DBDriver, cfg.DBSource)
	require.NoError(t, err)
	t.Cleanup(func() {
		t.Logf("Closing database: %s", dbSourceName)
		db.Close()
		// For mode=memory with cache=shared, the file might persist until all connections are closed.
		// Explicitly trying to remove it might be needed if issues arise, but typically not.
		// os.Remove(strings.Split(dbSourceName, "?")[0][5:]) // Attempt to remove if not purely in-memory
	})

	// Verify DB connection
	err = db.Ping()
	require.NoError(t, err, "Failed to ping database")
	t.Log("Database connection successful and pinged.")

	// Apply migrations
	applyMigrations(t, db, "../../migrations")

	application := &app.Application{
		Config: cfg,
		Logger: logger,
		DB:     db,
	}

	err = ParseJWTKeys(application)
	require.NoError(t, err, "Failed to parse JWT keys for application")
	require.NotNil(t, application.PrivateKey, "Private key should be parsed")
	require.NotNil(t, application.PublicKey, "Public key should be parsed")
	t.Log("JWT Keys parsed successfully.")


	engine := router.NewRouter(application)
	apiV1 := engine.Group("/api/v1")
	authHandler := &AuthHandler{App: application}
	RegisterRoutes(apiV1, authHandler, nil) // authMiddleware is nil as /register is public
	t.Log("Router and auth routes initialized.")

	return application, engine, db
}

func TestRegisterUser_Integration(t *testing.T) {
	_, engine, db := setupIntegrationTest(t)

	server := httptest.NewServer(engine)
	defer server.Close()
	t.Logf("Test server running on: %s", server.URL)

	registerURL := fmt.Sprintf("%s/api/v1/auth/register", server.URL)

	payload := RegisterRequest{
		Name:     "Integration Test User",
		Email:    "integration-" + fmt.Sprintf("%d", time.Now().UnixNano()) + "@example.com", // Unique email
		Password: "password123",
	}
	payloadBytes, err := json.Marshal(payload)
	require.NoError(t, err)

	t.Logf("Attempting to register user with email: %s", payload.Email)
	resp, err := http.Post(registerURL, "application/json", bytes.NewBuffer(payloadBytes))
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusCreated, resp.StatusCode, "HTTP status code should be 201 Created")
	t.Log("User registration returned StatusCreated.")

	var userResp UserResponse
	err = json.NewDecoder(resp.Body).Decode(&userResp)
	require.NoError(t, err, "Failed to decode response body")

	assert.NotEmpty(t, userResp.ID, "User ID should not be empty in response")
	assert.Equal(t, payload.Name, userResp.Name, "Name in response should match request")
	assert.Equal(t, payload.Email, userResp.Email, "Email in response should match request")
	t.Logf("User response validated: ID=%s, Name=%s, Email=%s", userResp.ID, userResp.Name, userResp.Email)

	// Verify in database
	t.Logf("Verifying user in database with email: %s", payload.Email)
	var dbUserID, dbEmail, dbPasswordHash string
	var dbDisplayName string
	row := db.QueryRowContext(context.Background(), "SELECT id, email, password_hash, display_name FROM users WHERE email = ?", payload.Email)
	err = row.Scan(&dbUserID, &dbEmail, &dbPasswordHash, &dbDisplayName)
	if err == sql.ErrNoRows {
		t.Fatalf("User with email %s not found in database after registration.", payload.Email)
	}
	require.NoError(t, err, "Failed to query user from database")

	assert.Equal(t, userResp.ID, dbUserID, "User ID in DB should match response")
	assert.Equal(t, payload.Email, dbEmail, "Email in DB should match request")
	assert.Equal(t, payload.Name, dbDisplayName, "Display name in DB should match request name")
	assert.NotEmpty(t, dbPasswordHash, "Password hash should not be empty in DB")
	t.Logf("User verified in database: ID=%s, Email=%s, Name=%s, HashNotEmpty=%t", dbUserID, dbEmail, dbDisplayName, dbPasswordHash != "")

	err = bcrypt.CompareHashAndPassword([]byte(dbPasswordHash), []byte(payload.Password))
	assert.NoError(t, err, "Hashed password in DB should match the provided password")
	t.Log("Password hash comparison successful.")
}

// Minimal test for ParseJWTKeys to ensure our dummy keys work with it.
func TestParseJWTKeys_WithDummyKeys(t *testing.T) {
	cfg := &config.Config{
		JWTPrivateKey: testJWTPrivateKeyPKCS1,
		JWTPublicKey:  testJWTPublicKey,
	}
	appInstance := &app.Application{
		Config: cfg,
		Logger: zap.NewNop(), // Using Nop logger for this specific util test
	}
	err := ParseJWTKeys(appInstance)
	require.NoError(t, err, "ParseJWTKeys should not error with the dummy keys")
	assert.NotNil(t, appInstance.PrivateKey)
	assert.NotNil(t, appInstance.PublicKey)
}
