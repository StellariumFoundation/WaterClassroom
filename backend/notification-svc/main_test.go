package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	// "gopkg.in/gomail.v2" // Removed as it's unused in tests focusing on buildMessageAndProcessTemplate
)

// setupTemplates creates a temporary templates directory with dummy files for testing.
// It returns the path to the temporary directory and a cleanup function.
func setupTestTemplates(t *testing.T) (string, func()) {
	// Create a temporary directory for templates relative to the test file
	// This assumes tests are run from the package directory.
	// The 'templates' dir used by main.go is at the root of the service.
	// For tests, we create a local 'test_templates_temp' to avoid conflict
	// and ensure tests don't rely on or mess with actual service templates.

	// Determine the correct base path. When 'go test' runs, it typically
	// sets the working directory to the package directory being tested.
	wd, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get working directory: %v", err)
	}

	// Create a unique temp dir for this test run to hold our 'templates' folder
	// This 'testRunTempDir' will contain 'templates/our_test_template.html'
	testRunTempDir, err := os.MkdirTemp(wd, "test_run_temp_*")
	if err != nil {
		t.Fatalf("Failed to create test run temp dir: %v", err)
	}

	templatesDir := filepath.Join(testRunTempDir, "templates")
	err = os.MkdirAll(templatesDir, 0755)
	if err != nil {
		t.Fatalf("Failed to create temporary templates directory %s: %v", templatesDir, err)
	}

	// Create a dummy template file
	testTemplateContent := "Hello {{.Name}}, your code is {{.Code}}."
	err = os.WriteFile(filepath.Join(templatesDir, "test_email.html"), []byte(testTemplateContent), 0644)
	if err != nil {
		os.RemoveAll(testRunTempDir) // Clean up if setup fails
		t.Fatalf("Failed to write test template file: %v", err)
	}

	// Create another template that expects a field not provided in one of the tests
	invalidTestTemplateContent := "This requires {{.RequiredField}}."
	err = os.WriteFile(filepath.Join(templatesDir, "test_invalid_data.html"), []byte(invalidTestTemplateContent), 0644)
	if err != nil {
		os.RemoveAll(testRunTempDir) // Clean up
		t.Fatalf("Failed to write invalid test template file: %v", err)
	}

	cleanupFunc := func() {
		os.RemoveAll(testRunTempDir)
	}

	// Return the path to the directory *containing* the 'templates' dir,
	// so that buildMessageAndProcessTemplate can use `filepath.Join(basePath, "templates", templateName)`
	return testRunTempDir, cleanupFunc
}


func TestBuildMessageAndProcessTemplate(t *testing.T) {
	baseTestPath, cleanup := setupTestTemplates(t)
	defer cleanup()

	cfg := &Config{
		SenderEmail: "testsender@example.com",
		// Other SMTP fields are not used in this specific test as we don't send email
	}

	t.Run("SuccessWithTemplate", func(t *testing.T) {
		to := "recipient@example.com"
		subject := "Test Subject"
		templateName := "test_email.html"
		templateData := map[string]interface{}{
			"Name": "Test User",
			"Code": "12345",
		}

		// Pass baseTestPath so the function looks for templates in testRunTempDir/templates/
		msg, bodyStr, err := buildMessageAndProcessTemplate(cfg, to, subject, "", templateName, templateData, baseTestPath)

		assert.NoError(t, err)
		assert.NotNil(t, msg)
		assert.Contains(t, bodyStr, "Hello Test User, your code is 12345.")

		assert.Equal(t, cfg.SenderEmail, msg.GetHeader("From")[0])
		assert.Equal(t, to, msg.GetHeader("To")[0])
		assert.Equal(t, subject, msg.GetHeader("Subject")[0])

		// Check body from message object (gomail might not expose this easily after SetBody)
		// For now, relying on the returned bodyStr for body content assertion.
	})

	t.Run("SuccessWithHTMLBody", func(t *testing.T) {
		to := "recipient@example.com"
		subject := "HTML Body Test"
		htmlBody := "<p>This is a direct HTML body.</p>"

		msg, bodyStr, err := buildMessageAndProcessTemplate(cfg, to, subject, htmlBody, "", nil, baseTestPath)

		assert.NoError(t, err)
		assert.NotNil(t, msg)
		assert.Equal(t, htmlBody, bodyStr) // bodyStr should be the direct HTML body

		assert.Equal(t, cfg.SenderEmail, msg.GetHeader("From")[0])
		assert.Equal(t, to, msg.GetHeader("To")[0])
		assert.Equal(t, subject, msg.GetHeader("Subject")[0])
	})

	t.Run("TemplateNotFound", func(t *testing.T) {
		_, _, err := buildMessageAndProcessTemplate(cfg, "to@example.com", "Sub", "", "nonexistent.html", nil, baseTestPath)
		assert.Error(t, err)
		// Check if the error is about file not found (os.IsNotExist might be too specific for template errors)
		assert.True(t, strings.Contains(err.Error(), "template") && (strings.Contains(err.Error(), "does not exist") || strings.Contains(err.Error(), "no such file") || strings.Contains(err.Error(), "not found")), "Error message should indicate template not found")
	})

	t.Run("TemplateExecutionError_MissingData", func(t *testing.T) {
		// Using test_invalid_data.html which expects {{.RequiredField}}
		templateName := "test_invalid_data.html"
		templateData := map[string]interface{}{ // Missing "RequiredField"
			"Name": "Test User",
		}

		_, _, err := buildMessageAndProcessTemplate(cfg, "to@example.com", "Sub", "", templateName, templateData, baseTestPath)
		assert.Error(t, err, "Expected an error due to missing key in template data")
		if err != nil { // Add this check to prevent panic on err.Error() if assert.Error fails
			// Example of what a missingkey=error might produce:
			// template: test_invalid_data.html:1:XXX: map has no entry for key "RequiredField"
			assert.True(t, strings.Contains(err.Error(), "map has no entry for key") && strings.Contains(err.Error(), "RequiredField"), "Error message should indicate missing key 'RequiredField'")
		}
	})

	t.Run("NoBodyOrTemplateProvided", func(t *testing.T) {
		msg, bodyStr, err := buildMessageAndProcessTemplate(cfg, "to@example.com", "Sub", "", "", nil, baseTestPath)
		assert.NoError(t, err) // Default behavior is to create a minimal body
		assert.NotNil(t, msg)
		assert.Contains(t, bodyStr, "default message")
	})
}

// Note: The actual sendEmail function uses gomail.DialAndSend, which is hard to test
// without mocks or a test SMTP server. The tests above focus on the part of sendEmail
// that we can control and verify: template processing and message construction.

// Mocking gomail.Dialer and its DialAndSend method would require either:
// 1. An interface for the dialer that gomail.Dialer implements (gomail does not provide this for Dialer itself).
// 2. Wrapping gomail.Dialer in our own struct that uses an interface for sending,
//    allowing us to inject a mock sender in tests.
// For this exercise, we are testing buildMessageAndProcessTemplate which handles logic before DialAndSend.

// To make the original sendEmail testable with gomail, one might define an interface:
// type MailDialer interface {
//    DialAndSend(m ...*gomail.Message) error
// }
// And then have a struct that can be either a real gomail.Dialer or a mock:
// type GomailSender struct {
//    Dialer MailDialer // In prod, this is *gomail.Dialer. In test, a mock.
// }
// sendEmail would then use this GomailSender.
// However, *gomail.Dialer itself does not implement a small interface for DialAndSend only.
// It has other methods. A common pattern is to define your own interface with just the methods you need.
// For gomail, you might need an interface like:
// type Dialer interface {
//     DialAndSend(m ...*Message) error
// }
// Then your sendEmail could accept this Dialer interface.
// func sendEmail(cfg *Config, d Dialer, to, subject, htmlBody, templateName string, templateData interface{}, templateBasePath string) error
// In production code, you'd pass a real *gomail.Dialer.
// In test code, you'd pass a mock Dialer.
// This requires `gomail.Message` to be the same, which it is.
// This is a more involved refactor of sendEmail's signature or how the dialer is obtained.
// The current test focuses on buildMessageAndProcessTemplate as a compromise.

// If main.go's sendEmail is refactored to accept a base path for templates,
// it would simplify testing without needing to manipulate current working directory
// or assuming a fixed "templates" subdir relative to CWD.
// e.g., func sendEmail(..., templateBasePath string)
// For now, buildMessageAndProcessTemplate takes templateBasePath.
