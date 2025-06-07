<script lang="ts">
  import { onMount } from 'svelte';
  import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js';

  let stripe: Stripe | null = null;
  let elements: StripeElements | null = null;
  let cardElement: StripeCardElement | null = null;
  let paymentMessage: string = '';
  let isLoading: boolean = false;

  // Replace with your actual publishable key
  const stripePublishableKey = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

  let clientSecret: string | null = null;
  let amount: number = 1000; // Example amount in cents
  let currency: string = 'usd'; // Example currency

  onMount(async () => {
    stripe = await loadStripe(stripePublishableKey);
    if (stripe) {
      elements = stripe.elements();
      cardElement = elements.create('card');
      cardElement.mount('#card-element');
    } else {
      paymentMessage = 'Failed to load Stripe.js';
    }
  });

  async function handleSubmit() {
    if (!stripe || !cardElement || !elements) {
      paymentMessage = 'Stripe.js not initialized correctly.';
      return;
    }

    isLoading = true;
    paymentMessage = '';

    try {
      // 1. Create PaymentIntent on the backend
      const response = await fetch('/api/v1/payments/create-payment-intent', { // Ensure this path is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          amount: amount, // amount in cents
          currency: currency,
          // Potentially add other details like order_id, customer_id if available
        }),
      });

      const paymentIntentData = await response.json();

      if (!response.ok) {
        paymentMessage = paymentIntentData.error || 'Failed to create PaymentIntent.';
        isLoading = false;
        return;
      }

      clientSecret = paymentIntentData.client_secret;

      if (!clientSecret) {
        paymentMessage = 'Client secret not received from server.';
        isLoading = false;
        return;
      }

      // 2. Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          // billing_details: { // Optional
          //   name: 'Jenny Rosen',
          // },
        },
      });

      if (error) {
        paymentMessage = error.message || 'Payment failed.';
        if (error.type === "card_error" || error.type === "validation_error") {
          console.error('Stripe card error:', error);
        } else {
          console.error('Unexpected Stripe error:', error);
        }
      } else if (paymentIntent?.status === 'succeeded') {
        paymentMessage = `Payment succeeded! PaymentIntent ID: ${paymentIntent.id}`;
        // TODO: Clear cart, show success page, etc.
      } else if (paymentIntent?.status === 'requires_action') {
        paymentMessage = 'Further action is required to complete the payment.';
        // Handle 3D Secure or other actions
      } else {
        paymentMessage = `Payment status: ${paymentIntent?.status}`;
      }
    } catch (e: any) {
      console.error('Payment processing error:', e);
      paymentMessage = 'An unexpected error occurred: ' + e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="payment-form-container">
  <h2>Secure Payment</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-row">
      <label for="card-element">
        Credit or debit card
      </label>
      <div id="card-element" class="StripeElement">
        <!-- A Stripe Element will be inserted here. -->
      </div>
    </div>

    <button type="submit" disabled={isLoading || !stripe}>
      {#if isLoading}
        Processing...
      {:else}
        Pay ${ (amount / 100).toFixed(2) } { currency.toUpperCase() }
      {/if}
    </button>

    {#if paymentMessage}
      <div
        class="payment-message"
        class:success={paymentMessage.startsWith('Payment succeeded')}
        class:error={!paymentMessage.startsWith('Payment succeeded')}
      >
        {paymentMessage}
      </div>
    {/if}
  </form>
</div>

<style>
  .payment-form-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .form-row {
    margin-bottom: 1rem;
  }
  .StripeElement {
    box-sizing: border-box;
    height: 40px;
    padding: 10px 12px;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    transition: box-shadow 150ms ease;
  }
  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }
  .StripeElement--invalid {
    border-color: #fa755a;
  }
  button {
    background-color: #6772e5; /* Stripe's purple */
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }
  button:hover {
    background-color: #5464c2;
  }
  button:disabled {
    background-color: #a9b3f9;
    cursor: not-allowed;
  }
  .payment-message {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    text-align: center;
  }
  .payment-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .payment-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>
