package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	// "strings" // May not be needed if not checking specific error messages deeply

	"github.com/company/payment-svc/internal" // Adjust if your module path is different
	"github.com/stretchr/testify/assert"
	"github.com/stripe/stripe-go/v76" // For *stripe.Error and other types
)

// MockPICreator is a local mock for the internal.PaymentIntentCreator interface.
type MockPICreator struct {
	MockNew func(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error)
}

func (m *MockPICreator) New(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
	if m.MockNew != nil {
		return m.MockNew(params)
	}
	return nil, fmt.Errorf("MockPICreator.MockNew is not set")
}

// MockWHConstructor is a local mock for the internal.StripeWebhookConstructor interface.
type MockWHConstructor struct {
	MockConstructEvent func(payload []byte, signatureHeader string, secret string) (stripe.Event, error)
}

func (m *MockWHConstructor) ConstructEvent(payload []byte, signatureHeader string, secret string) (stripe.Event, error) {
	if m.MockConstructEvent != nil {
		return m.MockConstructEvent(payload, signatureHeader, secret)
	}
	return stripe.Event{}, fmt.Errorf("MockWHConstructor.MockConstructEvent is not set")
}


func TestCreatePaymentIntentHandler(t *testing.T) {
	stripeService = internal.NewStripeClient("sk_test_dummy_main_test_pi")
	webhookSecretKey = "whsec_test_dummy_main_test_pi"


	tests := []struct {
		name               string
		httpMethod         string
		requestBody        interface{}
		setupMock          func(mockCreator *MockPICreator)
		expectedStatusCode int
		expectedResponse   map[string]string 
		expectedErrorMsg   string            
	}{
		{
			name:       "successful payment intent creation",
			httpMethod: http.MethodPost,
			requestBody: CreatePaymentIntentRequest{
				Amount:   1000,
				Currency: "usd",
			},
			setupMock: func(mockCreator *MockPICreator) {
				mockCreator.MockNew = func(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
					assert.Equal(t, int64(1000), *params.Amount)
					assert.Equal(t, "usd", *params.Currency)
					return &stripe.PaymentIntent{ClientSecret: "cs_123_test_secret"}, nil
				}
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   map[string]string{"client_secret": "cs_123_test_secret"},
		},
		{
			name:               "invalid JSON request body",
			httpMethod:         http.MethodPost,
			requestBody:        "not-json", 
			setupMock:          nil,        
			expectedStatusCode: http.StatusBadRequest,
			expectedErrorMsg:   "Invalid JSON request body", 
		},
		{
			name:       "invalid request data - zero amount",
			httpMethod: http.MethodPost,
			requestBody: CreatePaymentIntentRequest{
				Amount:   0, 
				Currency: "usd",
			},
			setupMock:          nil,
			expectedStatusCode: http.StatusBadRequest,
			expectedErrorMsg:   "Invalid amount: must be greater than 0",
		},
		{
			name:       "invalid request data - empty currency",
			httpMethod: http.MethodPost,
			requestBody: CreatePaymentIntentRequest{
				Amount:   1000,
				Currency: "", 
			},
			setupMock:          nil,
			expectedStatusCode: http.StatusBadRequest,
			expectedErrorMsg:   "Invalid currency: must not be empty",
		},
		{
			name:       "error from StripeService (simulated API error)",
			httpMethod: http.MethodPost,
			requestBody: CreatePaymentIntentRequest{
				Amount:   2000,
				Currency: "eur",
			},
			setupMock: func(mockCreator *MockPICreator) {
				mockCreator.MockNew = func(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
					return nil, &stripe.Error{Msg: "Simulated Stripe API Error"} 
				}
			},
			expectedStatusCode: http.StatusInternalServerError, 
			expectedErrorMsg:   "Error processing payment",
		},
		{
			name:       "error from StripeService (simulated non-Stripe error)",
			httpMethod: http.MethodPost,
			requestBody: CreatePaymentIntentRequest{
				Amount:   2500,
				Currency: "gbp",
			},
			setupMock: func(mockCreator *MockPICreator) {
				mockCreator.MockNew = func(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
					return nil, fmt.Errorf("a non-Stripe error occurred")
				}
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedErrorMsg:   "Internal server error while creating payment intent",
		},
		{
			name:               "method not allowed",
			httpMethod:         http.MethodGet, 
			requestBody:        nil,
			setupMock:          nil,
			expectedStatusCode: http.StatusMethodNotAllowed,
			expectedErrorMsg:   "Only POST method is allowed",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			mockPIClient := &MockPICreator{}
			if tc.setupMock != nil {
				tc.setupMock(mockPIClient)
			}
			stripeService.PIClient = mockPIClient 

			var reqBodyReader *bytes.Buffer
			if tc.requestBody != nil {
				if strBody, ok := tc.requestBody.(string); ok {
					reqBodyReader = bytes.NewBufferString(strBody)
				} else {
					jsonBody, err := json.Marshal(tc.requestBody)
					assert.NoError(t, err)
					reqBodyReader = bytes.NewBuffer(jsonBody)
				}
			} else {
				reqBodyReader = bytes.NewBuffer([]byte{})
			}

			req, err := http.NewRequest(tc.httpMethod, "/create-payment-intent", reqBodyReader)
			assert.NoError(t, err)
			if tc.requestBody != nil && tc.requestBody != "not-json" { 
				req.Header.Set("Content-Type", "application/json")
			}

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(createPaymentIntentHandler)
			handler.ServeHTTP(rr, req)

			assert.Equal(t, tc.expectedStatusCode, rr.Code, "HTTP status code mismatch")

			if tc.expectedResponse != nil {
				var actualResponse map[string]string
				err = json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err, "Failed to unmarshal JSON response")
				assert.Equal(t, tc.expectedResponse, actualResponse, "JSON response mismatch")
			} else if tc.expectedErrorMsg != "" {
				responseBodyStr := rr.Body.String()
				assert.Contains(t, responseBodyStr, tc.expectedErrorMsg, "Error message mismatch")
			}
		})
	}
}

func TestStripeWebhookHandler(t *testing.T) {
	stripeService = internal.NewStripeClient("sk_test_dummy_main_test_wh")
	webhookSecretKey = "whsec_test_dummy_main_test_wh" 

	dummyPayload := []byte(`{"type": "test_event"}`)

	tests := []struct {
		name               string
		httpMethod         string
		payload            []byte
		signatureHeader    string
		setupMock          func(mockWHConstructor *MockWHConstructor)
		expectedStatusCode int
		expectedResponse   map[string]string 
		expectedErrorMsg   string            
	}{
		{
			name:            "successful webhook processing - payment_intent.succeeded",
			httpMethod:      http.MethodPost,
			payload:         dummyPayload,
			signatureHeader: "t=123,v1=test_signature", 
			setupMock: func(mockWHConstructor *MockWHConstructor) {
				mockWHConstructor.MockConstructEvent = func(payload []byte, sigHeader string, secret string) (stripe.Event, error) {
					assert.Equal(t, dummyPayload, payload)
					assert.Equal(t, "t=123,v1=test_signature", sigHeader)
					assert.Equal(t, webhookSecretKey, secret)
					return stripe.Event{Type: stripe.EventTypePaymentIntentSucceeded}, nil
				}
			},
			expectedStatusCode: http.StatusOK,
			expectedResponse:   map[string]string{"status": "webhook processed"},
		},
		{
			name:            "signature verification error",
			httpMethod:      http.MethodPost,
			payload:         dummyPayload,
			signatureHeader: "t=123,v1=bad_signature",
			setupMock: func(mockWHConstructor *MockWHConstructor) {
				mockWHConstructor.MockConstructEvent = func(payload []byte, sigHeader string, secret string) (stripe.Event, error) {
					return stripe.Event{}, &stripe.Error{Msg: "stripe webhook signature verification failed"} 
				}
			},
			expectedStatusCode: http.StatusBadRequest,
			expectedErrorMsg:   "Webhook signature verification failed",
		},
		{
			name:            "other stripe error from service",
			httpMethod:      http.MethodPost,
			payload:         dummyPayload,
			signatureHeader: "t=123,v1=valid_signature",
			setupMock: func(mockWHConstructor *MockWHConstructor) {
				mockWHConstructor.MockConstructEvent = func(payload []byte, sigHeader string, secret string) (stripe.Event, error) {
					return stripe.Event{}, &stripe.Error{Msg: "some other stripe error"} 
				}
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedErrorMsg:   "Error processing webhook (Stripe error)",
		},
		{
			name:            "generic error from service",
			httpMethod:      http.MethodPost,
			payload:         dummyPayload,
			signatureHeader: "t=123,v1=valid_signature",
			setupMock: func(mockWHConstructor *MockWHConstructor) {
				mockWHConstructor.MockConstructEvent = func(payload []byte, sigHeader string, secret string) (stripe.Event, error) {
					return stripe.Event{}, fmt.Errorf("some internal error")
				}
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedErrorMsg:   "Error processing webhook (Internal error)",
		},
		{
			name:               "method not allowed",
			httpMethod:         http.MethodGet,
			payload:            dummyPayload,
			signatureHeader:    "t=123,v1=valid_signature",
			setupMock:          nil,
			expectedStatusCode: http.StatusMethodNotAllowed,
			expectedErrorMsg:   "Only POST method is allowed",
		},
		{
			name:               "missing Stripe-Signature header",
			httpMethod:         http.MethodPost,
			payload:            dummyPayload,
			signatureHeader:    "", 
			setupMock:          nil, 
			expectedStatusCode: http.StatusBadRequest,
			expectedErrorMsg:   "Missing Stripe-Signature header",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			mockWHClient := &MockWHConstructor{}
			if tc.setupMock != nil {
				tc.setupMock(mockWHClient)
			}
			stripeService.WHClient = mockWHClient

			req, err := http.NewRequest(tc.httpMethod, "/stripe-webhook", bytes.NewBuffer(tc.payload))
			assert.NoError(t, err)
			if tc.signatureHeader != "" {
				req.Header.Set("Stripe-Signature", tc.signatureHeader)
			}
			req.Header.Set("Content-Type", "application/json")


			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(stripeWebhookHandler)
			handler.ServeHTTP(rr, req)

			assert.Equal(t, tc.expectedStatusCode, rr.Code, "HTTP status code mismatch")

			if tc.expectedResponse != nil {
				var actualResponse map[string]string
				err = json.Unmarshal(rr.Body.Bytes(), &actualResponse)
				assert.NoError(t, err, "Failed to unmarshal JSON response")
				assert.Equal(t, tc.expectedResponse, actualResponse, "JSON response mismatch")
			} else if tc.expectedErrorMsg != "" {
				responseBodyStr := rr.Body.String()
				assert.Contains(t, responseBodyStr, tc.expectedErrorMsg, "Error message mismatch")
			}
		})
	}
}

func TestPaymentHistoryHandler(t *testing.T) {
	// This test function was requested to be fleshed out.
	// The handler itself is a placeholder in main.go, so these tests will reflect that.

	tests := []struct {
		name               string
		httpMethod         string
		expectedStatusCode int
		expectedContentType string
		checkResponse      func(t *testing.T, rr *httptest.ResponseRecorder)
	}{
		{
			name:       "successful retrieval (GET request)",
			httpMethod: http.MethodGet,
			expectedStatusCode: http.StatusOK,
			expectedContentType: "application/json",
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				var history []map[string]string
				err := json.Unmarshal(rr.Body.Bytes(), &history)
				assert.NoError(t, err, "Failed to unmarshal response body")
				assert.NotNil(t, history, "Response should not be nil")
				assert.Len(t, history, 2, "Expected 2 items in history")
				if len(history) > 0 {
					assert.Equal(t, "txn_1", history[0]["id"])
					assert.Equal(t, "10.00", history[0]["amount"])
				}
			},
		},
		{
			name:       "method not allowed (POST request)",
			httpMethod: http.MethodPost,
			expectedStatusCode: http.StatusMethodNotAllowed,
			checkResponse: func(t *testing.T, rr *httptest.ResponseRecorder) {
				assert.Contains(t, rr.Body.String(), "Only GET method is allowed")
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req, err := http.NewRequest(tc.httpMethod, "/payments/history", nil)
			assert.NoError(t, err)

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(paymentHistoryHandler)
			handler.ServeHTTP(rr, req)

			assert.Equal(t, tc.expectedStatusCode, rr.Code, "HTTP status code mismatch")
			if tc.expectedContentType != "" {
				assert.Equal(t, tc.expectedContentType, rr.Header().Get("Content-Type"), "Content-Type mismatch")
			}

			if tc.checkResponse != nil {
				tc.checkResponse(t, rr)
			}
		})
	}
}
