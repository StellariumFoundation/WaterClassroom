<script lang="ts">
  import PaymentForm from '$lib/components/payments/PaymentForm.svelte';
</script>

<svelte:head>
  <title>Make a Payment</title>
  <meta name="description" content="Secure payment page to complete your transaction." />
</svelte:head>

<div class="payment-page-container">
  <h1>Complete Your Payment</h1>
  <p>Please enter your card details below. Your payment information is processed securely by Stripe.</p>

  <PaymentForm />

  <div class="payment-info">
    <p>
      We accept major credit and debit cards. All transactions are encrypted and secure.
      If you have any issues, please contact our support.
    </p>
  </div>
</div>

<style>
  .payment-page-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1rem;
    text-align: center;
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .payment-info {
    margin-top: 2rem;
    font-size: 0.9em;
    color: #777;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
</style>
