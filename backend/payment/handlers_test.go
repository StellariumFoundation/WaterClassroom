package payment

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stripe/stripe-go/v82"
	"go.uber.org/zap"

	"github.com/water-classroom/backend/config"
)

// MockPaymentService is a mock implementation of the PaymentService.
type MockPaymentService struct {
	mock.Mock
}

func (m *MockPaymentService) CreateCustomer(input CreateCustomerInput) (*stripe.Customer, error) {
	args := m.Called(input)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.Customer), args.Error(1)
}

func (m *MockPaymentService) CreatePaymentIntent(input CreatePaymentIntentInput) (*stripe.PaymentIntent, error) {
	args := m.Called(input)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}

func (m *MockPaymentService) HandleWebhook(body []byte, signatureHeader string, webhookSecret string) error {
	args := m.Called(body, signatureHeader, webhookSecret)
	return args.Error(0)
}

func setupTestHandlers(t *testing.T) (*gin.Engine, *MockPaymentService, *config.Config) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	mockService := new(MockPaymentService)
	logger, _ := zap.NewNop().Build() // Use NewNop for tests unless logs are being checked

	// Mock config
	cfg := &config.Config{
		Stripe: config.StripeConfig{
			WebhookSecret: "whsec_test_handler_secret",
		},
	}

	paymentHandlers := NewPaymentHandlers(mockService, logger, cfg)

	// Register routes (simplified for handler testing)
	// Normally these would be in a routes.go setup
	router.POST("/payments/create-payment-intent", paymentHandlers.CreatePaymentIntentHandler)
	router.POST("/payments/webhook", paymentHandlers.StripeWebhookHandler)

	return router, mockService, cfg
}

func TestPaymentHandlers_CreatePaymentIntentHandler_Success(t *testing.T) {
	router, mockService, _ := setupTestHandlers(t)

	input := CreatePaymentIntentInput{
		Amount:   2000,
		Currency: "usd",
		OrderID:  "order_test_123",
	}
	expectedPI := &stripe.PaymentIntent{
		ID:           "pi_test_handler",
		ClientSecret: "pi_test_handler_secret",
		Amount:       input.Amount,
		Currency:     input.Currency,
	}

	mockService.On("CreatePaymentIntent", input).Return(expectedPI, nil).Once()

	bodyBytes, _ := json.Marshal(input)
	req, _ := http.NewRequest(http.MethodPost, "/payments/create-payment-intent", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var responseBody map[string]string
	err := json.Unmarshal(rr.Body.Bytes(), &responseBody)
	assert.NoError(t, err)
	assert.Equal(t, expectedPI.ClientSecret, responseBody["client_secret"])
	assert.Equal(t, expectedPI.ID, responseBody["payment_intent_id"])

	mockService.AssertExpectations(t)
}

func TestPaymentHandlers_CreatePaymentIntentHandler_BindError(t *testing.T) {
	router, _, _ := setupTestHandlers(t)

	req, _ := http.NewRequest(http.MethodPost, "/payments/create-payment-intent", strings.NewReader("this is not json"))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
	// Optionally check error message in response body
	assert.Contains(t, rr.Body.String(), "Invalid request body")
}

func TestPaymentHandlers_CreatePaymentIntentHandler_ServiceError(t *testing.T) {
	router, mockService, _ := setupTestHandlers(t)
	input := CreatePaymentIntentInput{Amount: 1500, Currency: "eur"}
	serviceErr := errors.New("failed to create PI in service")

	mockService.On("CreatePaymentIntent", input).Return(nil, serviceErr).Once()

	bodyBytes, _ := json.Marshal(input)
	req, _ := http.NewRequest(http.MethodPost, "/payments/create-payment-intent", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	assert.Contains(t, rr.Body.String(), "Failed to create PaymentIntent")
	mockService.AssertExpectations(t)
}

func TestPaymentHandlers_StripeWebhookHandler_Success(t *testing.T) {
	router, mockService, cfg := setupTestHandlers(t)
	payload := []byte(`{"type": "payment_intent.succeeded"}`)
	signature := "dummy_signature" // Actual signature generation/verification is complex for unit tests

	// Mock service's HandleWebhook
	mockService.On("HandleWebhook", payload, signature, cfg.Stripe.WebhookSecret).Return(nil).Once()

	req, _ := http.NewRequest(http.MethodPost, "/payments/webhook", bytes.NewBuffer(payload))
	req.Header.Set("Stripe-Signature", signature)
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), `"status":"success"`)
	mockService.AssertExpectations(t)
}

func TestPaymentHandlers_StripeWebhookHandler_ReadBodyError(t *testing.T) {
	// This is hard to simulate with httptest.Recorder as it usually handles body reading well.
	// We can test it by providing a faulty reader to gin.Context.Request.Body if possible,
	// or trust that gin/http package handles this.
	// For now, skipping direct test of ReadRequestBody failure within handler,
	// as ReadRequestBody itself can be unit tested separately if complex.
	// The MaxBytesReader will cause an error if payload is too large.
	router, _, _ := setupTestHandlers(t)
	largePayload := bytes.Repeat([]byte{'a'}, 70000) // > 64KB

	req, _ := http.NewRequest(http.MethodPost, "/payments/webhook", bytes.NewBuffer(largePayload))
	req.Header.Set("Stripe-Signature", "sig")
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusRequestEntityTooLarge, rr.Code) // Gin's default for MaxBytesReader
}


func TestPaymentHandlers_StripeWebhookHandler_MissingSecret(t *testing.T) {
	router, _, _ := setupTestHandlers(t) // Use default cfg with secret

	// Create a new handler with a config that has no webhook secret
	emptyCfg := &config.Config{Stripe: config.StripeConfig{WebhookSecret: ""}}
	logger, _ := zap.NewNop().Build()
	mockServiceForEmptySecret := new(MockPaymentService) // Fresh mock, no expectations needed
	handlerWithNoSecret := NewPaymentHandlers(mockServiceForEmptySecret, logger, emptyCfg)

	// Temporarily override the route to use this specific handler instance
	router.POST("/payments/webhook-no-secret-test", handlerWithNoSecret.StripeWebhookHandler)


	payload := []byte(`{}`)
	req, _ := http.NewRequest(http.MethodPost, "/payments/webhook-no-secret-test", bytes.NewBuffer(payload))
	req.Header.Set("Stripe-Signature", "sig")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
	assert.Contains(t, rr.Body.String(), "Webhook secret not configured")
}


func TestPaymentHandlers_StripeWebhookHandler_ServiceError(t *testing.T) {
	router, mockService, cfg := setupTestHandlers(t)
	payload := []byte(`{"type": "payment_intent.failed"}`)
	signature := "sig123"
	serviceErr := errors.New("webhook processing failed in service")
	// Example of how service might return a specific error type for signature issues
	// type StripeSignatureError struct{ error }
	// func (e StripeSignatureError) SignatureMismatch() bool { return true }
	// serviceErrWithSigMismatch := StripeSignatureError{errors.New("sig mismatch")}


	mockService.On("HandleWebhook", payload, signature, cfg.Stripe.WebhookSecret).Return(serviceErr).Once()
	// To test the signature mismatch path:
	// mockService.On("HandleWebhook", payload, signature, cfg.Stripe.WebhookSecret).Return(serviceErrWithSigMismatch).Once()


	req, _ := http.NewRequest(http.MethodPost, "/payments/webhook", bytes.NewBuffer(payload))
	req.Header.Set("Stripe-Signature", signature)

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code) // Default for generic errors
	assert.Contains(t, rr.Body.String(), "Webhook handler error")
	// To test signature mismatch causing 400:
	// assert.Equal(t, http.StatusBadRequest, rr.Code)
	// assert.Contains(t, rr.Body.String(), "Webhook signature verification failed")

	mockService.AssertExpectations(t)
}

// Note: The test for signature mismatch causing a 400 Bad Request from the handler
// depends on how the error is propagated from the service's HandleWebhook method.
// The service's HandleWebhook currently returns a generic error for signature issues.
// If it were to return a specific error type that the handler could inspect (e.g., by type assertion
// or checking an interface method like `SignatureMismatch() bool`), then the handler could return 400.
// The current handler code has a placeholder for this: `if _, ok := err.(interface{ SignatureMismatch() bool }); ok { ... }`
// To fully test that, the mock service error would need to implement such an interface/type.
// For now, InternalServerError is tested for generic service errors.
