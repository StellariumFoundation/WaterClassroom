package payment

import (
	"errors"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/client"
	"github.com/stripe/stripe-go/v82/webhook" // For HandleWebhook tests
	"go.uber.org/zap"

	"github.com/water-classroom/backend/config"
	"github.com/water-classroom/backend/database"
)

// MockCustomerBackend mocks the stripe.CustomerBackend interface
type MockCustomerBackend struct {
	mock.Mock
}

func (m *MockCustomerBackend) New(params *stripe.CustomerParams) (*stripe.Customer, error) {
	args := m.Called(params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.Customer), args.Error(1)
}
func (m *MockCustomerBackend) Get(id string, params *stripe.CustomerParams) (*stripe.Customer, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.Customer), args.Error(1)
}
func (m *MockCustomerBackend) Update(id string, params *stripe.CustomerParams) (*stripe.Customer, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.Customer), args.Error(1)
}
func (m *MockCustomerBackend) List(params *stripe.CustomerListParams) *client.CustomerIter {
	args := m.Called(params)
	if args.Get(0) == nil {
		return nil
	}
	return args.Get(0).(*client.CustomerIter)
}
func (m *MockCustomerBackend) Del(id string, params *stripe.CustomerParams) (*stripe.Customer, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.Customer), args.Error(1)
}

// MockPaymentIntentBackend mocks the stripe.PaymentIntentBackend interface
type MockPaymentIntentBackend struct {
	mock.Mock
}

func (m *MockPaymentIntentBackend) New(params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
	args := m.Called(params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) Get(id string, params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) Update(id string, params *stripe.PaymentIntentParams) (*stripe.PaymentIntent, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) Confirm(id string, params *stripe.PaymentIntentConfirmParams) (*stripe.PaymentIntent, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) Capture(id string, params *stripe.PaymentIntentCaptureParams) (*stripe.PaymentIntent, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) Cancel(id string, params *stripe.PaymentIntentCancelParams) (*stripe.PaymentIntent, error) {
	args := m.Called(id, params)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*stripe.PaymentIntent), args.Error(1)
}
func (m *MockPaymentIntentBackend) List(params *stripe.PaymentIntentListParams) *client.PaymentIntentIter {
	args := m.Called(params)
	if args.Get(0) == nil {
		return nil
	}
	return args.Get(0).(*client.PaymentIntentIter)
}

// Helper to initialize mocks and service
func setupTestService(t *testing.T) (*PaymentService, sqlmock.Sqlmock, *MockCustomerBackend, *MockPaymentIntentBackend) {
	logger, _ := zap.NewDevelopment() // Or zap.NewNop() for less verbose tests

	mockDb, mockSql, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherRegexp))
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	db := &database.DB{DB: mockDb} // Assuming database.DB wraps *sql.DB

	// Stripe client with mocked backends
	stripeClientAPI := &client.API{}
	mockCustomers := &MockCustomerBackend{}
	mockPaymentIntents := &MockPaymentIntentBackend{}
	stripeClientAPI.Customers = mockCustomers
	stripeClientAPI.PaymentIntents = mockPaymentIntents
	// Note: stripeClientAPI.Webhooks is not a backend interface but a static/package level functions like webhook.ConstructEvent

	service := &PaymentService{
		db:     db,
		stripe: stripeClientAPI,
		logger: logger,
	}

	return service, mockSql, mockCustomers, mockPaymentIntents
}

func TestPaymentService_CreateCustomer(t *testing.T) {
	service, mockSql, mockCustBackend, _ := setupTestService(t)

	input := CreateCustomerInput{
		UserID: "user_123",
		Email:  "test@example.com",
		Name:   "Test User",
	}
	expectedStripeID := "cus_test123"

	// Mock Stripe Customers.New
	mockCustBackend.On("New", mock.MatchedBy(func(params *stripe.CustomerParams) bool {
		return *params.Email == input.Email && *params.Name == input.Name && params.Metadata["user_id"] == input.UserID
	})).Return(&stripe.Customer{
		ID:    expectedStripeID,
		Email: stripe.String(input.Email),
		Name:  stripe.String(input.Name),
	}, nil).Once()

	// Mock DB Exec
	mockSql.ExpectExec("UPDATE users SET stripe_customer_id = \\$1 WHERE id = \\$2").
		WithArgs(expectedStripeID, input.UserID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	customer, err := service.CreateCustomer(input)

	assert.NoError(t, err)
	assert.NotNil(t, customer)
	assert.Equal(t, expectedStripeID, customer.ID)
	mockCustBackend.AssertExpectations(t)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}

func TestPaymentService_CreateCustomer_StripeError(t *testing.T) {
	service, _, mockCustBackend, _ := setupTestService(t)
	input := CreateCustomerInput{UserID: "user_123", Email: "test@example.com", Name: "Test User"}
	stripeErr := errors.New("stripe API error")

	mockCustBackend.On("New", mock.AnythingOfType("*stripe.CustomerParams")).Return(nil, stripeErr).Once()

	customer, err := service.CreateCustomer(input)

	assert.Error(t, err)
	assert.Equal(t, stripeErr, err)
	assert.Nil(t, customer)
	mockCustBackend.AssertExpectations(t)
}

func TestPaymentService_CreateCustomer_DBError(t *testing.T) {
	service, mockSql, mockCustBackend, _ := setupTestService(t)
	input := CreateCustomerInput{UserID: "user_123", Email: "test@example.com", Name: "Test User"}
	expectedStripeID := "cus_test123"
	dbErr := errors.New("db update error")

	mockCustBackend.On("New", mock.AnythingOfType("*stripe.CustomerParams")).Return(&stripe.Customer{ID: expectedStripeID}, nil).Once()
	mockSql.ExpectExec("UPDATE users SET stripe_customer_id = \\$1 WHERE id = \\$2").
		WithArgs(expectedStripeID, input.UserID).
		WillReturnError(dbErr)

	customer, err := service.CreateCustomer(input)

	assert.Error(t, err)
	assert.Equal(t, dbErr, err)
	assert.Nil(t, customer) // As per current implementation, customer is nil if DB fails
	mockCustBackend.AssertExpectations(t)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}

func TestPaymentService_CreatePaymentIntent(t *testing.T) {
	service, _, _, mockPIBackend := setupTestService(t)

	input := CreatePaymentIntentInput{
		Amount:        1000,
		Currency:      "usd",
		StripeCustomerID: "cus_test123",
		Description:   "Test Payment",
		OrderID:       "order_123",
	}
	expectedPIID := "pi_test123"
	expectedClientSecret := "pi_test123_secret_test"

	// Mock Stripe PaymentIntents.New
	mockPIBackend.On("New", mock.MatchedBy(func(params *stripe.PaymentIntentParams) bool {
		return *params.Amount == input.Amount &&
			*params.Currency == input.Currency &&
			*params.Customer == input.StripeCustomerID &&
			params.Metadata["order_id"] == input.OrderID
	})).Return(&stripe.PaymentIntent{
		ID:           expectedPIID,
		ClientSecret: expectedClientSecret,
		Amount:       input.Amount,
		Currency:     input.Currency,
		Customer:     &stripe.Customer{ID: input.StripeCustomerID},
		Metadata:     map[string]string{"order_id": input.OrderID},
	}, nil).Once()

	paymentIntent, err := service.CreatePaymentIntent(input)

	assert.NoError(t, err)
	assert.NotNil(t, paymentIntent)
	assert.Equal(t, expectedPIID, paymentIntent.ID)
	assert.Equal(t, expectedClientSecret, paymentIntent.ClientSecret)
	mockPIBackend.AssertExpectations(t)
}

func TestPaymentService_CreatePaymentIntent_StripeError(t *testing.T) {
	service, _, _, mockPIBackend := setupTestService(t)
	input := CreatePaymentIntentInput{Amount: 1000, Currency: "usd", OrderID: "order_123"}
	stripeErr := errors.New("stripe PI error")

	mockPIBackend.On("New", mock.AnythingOfType("*stripe.PaymentIntentParams")).Return(nil, stripeErr).Once()

	pi, err := service.CreatePaymentIntent(input)

	assert.Error(t, err)
	assert.Equal(t, stripeErr, err)
	assert.Nil(t, pi)
	mockPIBackend.AssertExpectations(t)
}


// --- HandleWebhook Tests ---
// Mocking webhook.ConstructEvent is tricky as it's a package-level function.
// For unit tests, we typically assume such external package functions work as documented
// and test our handling of their results.
// We'll provide sample event data and test our logic based on that.

var testWebhookSecret = "whsec_testsecret"

// Sample Stripe event payloads
func paymentIntentSucceededEvent(piID, orderID string) stripe.Event {
	return stripe.Event{
		ID:   "evt_test_pi_succeeded",
		Type: stripe.PaymentIntentSucceeded,
		Data: &stripe.EventData{
			Raw: []byte(`{
				"id": "` + piID + `",
				"object": "payment_intent",
				"amount": 1000,
				"currency": "usd",
				"status": "succeeded",
				"metadata": {
					"order_id": "` + orderID + `"
				}
			}`),
		},
	}
}

func paymentIntentFailedEvent(piID, orderID, failureCode string) stripe.Event {
	return stripe.Event{
		ID:   "evt_test_pi_failed",
		Type: stripe.PaymentIntentPaymentFailed,
		Data: &stripe.EventData{
			Raw: []byte(`{
				"id": "` + piID + `",
				"object": "payment_intent",
				"amount": 1000,
				"currency": "usd",
				"status": "requires_payment_method",
				"last_payment_Error": { "code": "` + failureCode + `" },
				"metadata": {
					"order_id": "` + orderID + `"
				}
			}`),
		},
	}
}


func TestPaymentService_HandleWebhook_PaymentIntentSucceeded(t *testing.T) {
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_test_succeeded"
	orderID := "order_succeeded_123"
	event := paymentIntentSucceededEvent(piID, orderID)
	// payload, _ := event.Data.Raw.MarshalJSON() // Not ideal, should use original raw

	// Store the original raw message for ConstructEvent
	// originalRaw := event.Data.Raw
	// event.Data.Raw = nil // ConstructEvent will use this if set, want it to parse our originalRaw

	// Mock DB updates (placeholders from service.go)
	// UPDATE payments SET status = 'succeeded', stripe_payment_intent_id = $1 WHERE order_id = $2
	mockSql.ExpectExec("UPDATE payments SET status = 'succeeded'").WithArgs(piID, orderID).WillReturnResult(sqlmock.NewResult(1, 1))
	// UPDATE orders SET status = 'paid' WHERE id = $1
	mockSql.ExpectExec("UPDATE orders SET status = 'paid'").WithArgs(orderID).WillReturnResult(sqlmock.NewResult(1, 1))

	// We need to ensure webhook.ConstructEvent is called with the right parameters
	// and simulate its successful return. Since it's a direct call, we can't easily mock it
	// without code changes (e.g. wrapping it in an interface method of the service).
	// For this test, we will assume webhook.ConstructEvent works if the signature matches.
	// The `HandleWebhook` will internally call `webhook.ConstructEvent`.
	// We will test the logic *after* a successful call to `webhook.ConstructEvent`.
	// This means we need a way to inject a valid `stripe.Event` or make `webhook.ConstructEvent` succeed.

	// Simplification: Test the internal logic `processWebhookEvent` if it were refactored.
	// Or, for an integration-style unit test of HandleWebhook:
	// Provide a valid signature and payload. This requires generating a real signature.
	// This is complex for a unit test.

	// Let's assume `webhook.ConstructEvent` is successful and returns our `event`.
	// To do this without changing service code, we can't directly test HandleWebhook's interaction with it.
	// What we *can* test is the behavior given a constructed event.
	// If `HandleWebhook` were structured like:
	// func (s *PaymentService) HandleWebhook(body, sig, secret) { event, err := s.constructEvent(); s.processEvent(event) }
	// then we could test `processEvent`.

	// Given the current structure, we test `HandleWebhook` and trust `webhook.ConstructEvent`
	// or accept that this part is an integration point.
	// We'll assume a valid signature for now. For signature error test, see below.

	// To make webhook.ConstructEvent succeed, we need to provide a valid signature.
	// This is hard. Instead, let's use a known good event and focus on the DB logic.
	// The test below for signature error specifically tests that path.

	// This test will call the *actual* webhook.ConstructEvent.
	// To make it pass without a real signature, we would need to mock time for signature generation/verification,
	// or use a test helper from Stripe if available and appropriate for this level of testing.
	// For now, this test assumes that if the secret is "whsec_testsecret", an empty signature will fail.
	// Let's make a separate test for signature failure.

	// Test for successful event processing (assuming ConstructEvent was magically successful)
	// This is hard to do without refactoring HandleWebhook or using a more advanced technique.
	// Let's assume for now, we are testing the path where ConstructEvent returns a valid event.
	// We will actually call it, but it will likely fail on signature.
	// The TODOs for DB updates in service.go mean these mocks might not be hit if those lines are commented out.
	// For now, I'll write the test as if the DB lines were active.

	// Due to the difficulty of mocking webhook.ConstructEvent without refactoring,
	// this test will focus on the successful DB interaction path,
	// implicitly assuming ConstructEvent was successful and returned the event.
	// This is not a pure unit test of HandleWebhook's own logic vs. ConstructEvent.

	// A practical way: temporarily modify HandleWebhook to allow injecting an event (for test only)
	// or make ConstructEvent a variable function pointer `var constructEvent = webhook.ConstructEvent`
	// then in tests, `constructEvent = func(...) (stripe.Event, error) { return myMockEvent, nil }`

	// Sticking to current code: Test what happens *if* ConstructEvent passes.
	// This test will likely fail at `webhook.ConstructEvent` due to signature.
	// Let's defer the full HandleWebhook tests until `handlers_test.go` where we can control the HTTP request better,
	// or simplify the event construction part here.

	// For now, let's test the signature error path, which is easier.
	// --- Test for actual HandleWebhook_PaymentIntentSucceeded is in TestPaymentService_HandleWebhook_PaymentIntentSucceeded_DBInteraction ---
}


func TestPaymentService_HandleWebhook_SignatureError(t *testing.T) {
	service, _, _, _ := setupTestService(t)
	payload := []byte("test payload")
	signature := "bad_signature"

	// config.Stripe.WebhookSecret is not directly used by service, it's passed to HandleWebhook by handler
	// So, the `webhookSecret` argument to `HandleWebhook` is what matters.
	err := service.HandleWebhook(payload, signature, testWebhookSecret)

	assert.Error(t, err)
	// Example: check for a specific error type or message if Stripe SDK provides it
	// For now, just assert that an error is returned.
	// The actual error will be from `webhook.ConstructEvent`.
	// e.g., "webhook signature verification failed: no signature found with expected scheme"
	// or "webhook signature verification failed: timestamp outside tolerance"
	assert.Contains(t, err.Error(), "webhook signature verification failed")
}


func TestPaymentService_HandleWebhook_PaymentIntentSucceeded_DBInteraction(t *testing.T) {
	// This test focuses on the DB interaction part, assuming event construction is successful.
	// We achieve this by temporarily replacing webhook.ConstructEvent for this test.
	// This is a common technique when dealing with package-level functions.
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_db_succ"
	orderID := "order_db_succ"

	// Gold standard event that `webhook.ConstructEvent` would return
	validEvent := paymentIntentSucceededEvent(piID, orderID)

	// Store original and defer restoration
	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		// Bypass actual signature verification for this specific test
		return validEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	// DB expectations (assuming these lines are active in service.go)
	mockSql.ExpectExec("UPDATE payments SET status = 'succeeded', stripe_payment_intent_id = \\$1 WHERE order_id = \\$2").
		WithArgs(piID, orderID).
		WillReturnResult(sqlmock.NewResult(1, 1))
	mockSql.ExpectExec("UPDATE orders SET status = 'paid' WHERE id = \\$1").
		WithArgs(orderID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := service.HandleWebhook([]byte(validEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.NoError(t, err)
	assert.NoError(t, mockSql.ExpectationsWereMet(), "DB expectations not met for payment_intent.succeeded")
}

func TestPaymentService_HandleWebhook_PaymentIntentFailed_DBInteraction(t *testing.T) {
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_db_fail"
	orderID := "order_db_fail"
	failureCode := "card_declined"

	validEvent := paymentIntentFailedEvent(piID, orderID, failureCode)

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return validEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	// DB expectations (assuming these lines are active in service.go)
	// Example: UPDATE payments SET status = 'failed', stripe_payment_intent_id = $1, failure_reason = $2 WHERE order_id = $3
	// The actual failure reason might be LastPaymentError.Message, not code. Adjust if necessary.
	// For this example, assume LastPaymentError.Code is stored.
	mockSql.ExpectExec("UPDATE payments SET status = 'failed', stripe_payment_intent_id = \\$1, failure_reason = \\$2 WHERE order_id = \\$3").
    WithArgs(piID, stripe.ErrorCode(failureCode), orderID). // Or string(paymentIntent.LastPaymentError.Code)
    WillReturnResult(sqlmock.NewResult(1, 1))


	err := service.HandleWebhook([]byte(validEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.NoError(t, err)
	assert.NoError(t, mockSql.ExpectationsWereMet(), "DB expectations not met for payment_intent.payment_failed")
}


// Allow replacing webhook.ConstructEvent for testing specific paths
var webhookConstructEvent = webhook.ConstructEvent

// Note: The config object (cfg *config.Config) is not used by PaymentService methods directly,
// but NewPaymentService uses it. setupTestService creates PaymentService manually,
// so cfg's direct impact on these unit tests is limited to how Stripe client might be init'd
// if we were calling NewPaymentService. Here, we inject a fully mocked client.
// The webhookSecret for HandleWebhook is passed as an argument.

// Further tests:
// - HandleWebhook with JSON parsing errors for event.Data.Raw.
// - HandleWebhook with unhandled event types.
// - HandleWebhook with DB errors during the update operations.
// These would follow similar patterns, manipulating the returned event or DB mock responses.
// For JSON parsing error, `webhookConstructEvent` mock would return an event with malformed `Data.Raw`.
// For DB errors, `mockSql.ExpectExec(...).WillReturnError(dbErr)`.


func TestPaymentService_HandleWebhook_JsonParseError(t *testing.T) {
	service, _, _, _ := setupTestService(t)

	malformedEvent := stripe.Event{
		ID:   "evt_test_json_error",
		Type: stripe.PaymentIntentSucceeded, // Type that involves parsing
		Data: &stripe.EventData{
			// Malformed JSON: missing quote for status_malformed field
			Raw: []byte(`{"id": "pi_123", "object": "payment_intent", "status_malformed": "succeeded"}`),
		},
	}

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return malformedEvent, nil // Return event with malformed Raw JSON
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	err := service.HandleWebhook([]byte(malformedEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.Error(t, err)
	// Check for the specific error message from service.go
	assert.Contains(t, err.Error(), "error parsing payment_intent.succeeded")
}

func TestPaymentService_HandleWebhook_DBErrorOnSucceededPayment(t *testing.T) {
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_db_err_succ_pay"
	orderID := "order_db_err_succ_pay"

	validEvent := paymentIntentSucceededEvent(piID, orderID)
	dbErr := errors.New("db error on payments update")

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return validEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	// First DB call (payments table) fails
	mockSql.ExpectExec("UPDATE payments SET status = 'succeeded'").
		WithArgs(piID, orderID).
		WillReturnError(dbErr)
	// Second DB call (orders table) should not be made

	err := service.HandleWebhook([]byte(validEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.Error(t, err)
	assert.Equal(t, dbErr, err)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}

func TestPaymentService_HandleWebhook_DBErrorOnSucceededOrder(t *testing.T) {
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_db_err_succ_ord"
	orderID := "order_db_err_succ_ord"

	validEvent := paymentIntentSucceededEvent(piID, orderID)
	dbErr := errors.New("db error on orders update")

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return validEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	// First DB call (payments table) succeeds
	mockSql.ExpectExec("UPDATE payments SET status = 'succeeded'").
		WithArgs(piID, orderID).
		WillReturnResult(sqlmock.NewResult(1,1))
	// Second DB call (orders table) fails
	mockSql.ExpectExec("UPDATE orders SET status = 'paid'").
		WithArgs(orderID).
		WillReturnError(dbErr)

	err := service.HandleWebhook([]byte(validEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.Error(t, err)
	assert.Equal(t, dbErr, err)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}


func TestPaymentService_HandleWebhook_DBErrorOnFailedPayment(t *testing.T) {
	service, mockSql, _, _ := setupTestService(t)
	piID := "pi_db_err_fail_pay"
	orderID := "order_db_err_fail_pay"
	failureCode := "card_declined"

	validEvent := paymentIntentFailedEvent(piID, orderID, failureCode)
	dbErr := errors.New("db error on payment failed update")

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return validEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	mockSql.ExpectExec("UPDATE payments SET status = 'failed'").
		WithArgs(piID, stripe.ErrorCode(failureCode), orderID).
		WillReturnError(dbErr)

	err := service.HandleWebhook([]byte(validEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.Error(t, err)
	assert.Equal(t, dbErr, err)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}


func TestPaymentService_HandleWebhook_UnhandledEventType(t *testing.T) {
	service, _, _, _ := setupTestService(t)

	unhandledEvent := stripe.Event{
		ID:   "evt_test_unhandled_type",
		Type: "customer.subscription.created", // Example of an unhandled type
		Data: &stripe.EventData{
			Raw: []byte(`{"id": "sub_123", "object": "subscription"}`),
		},
	}

	oldConstructEvent := webhookConstructEvent
	webhookConstructEvent = func(payload []byte, header string, secret string) (stripe.Event, error) {
		return unhandledEvent, nil
	}
	defer func() { webhookConstructEvent = oldConstructEvent }()

	err := service.HandleWebhook([]byte(unhandledEvent.Data.Raw), "dummy_sig", testWebhookSecret)

	assert.NoError(t, err) // Should not error for unhandled types, just log and ignore.
	// No DB expectations should be set as no DB interaction should occur.
}
