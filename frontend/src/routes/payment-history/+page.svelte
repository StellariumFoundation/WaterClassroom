<script lang="ts">
  import PaymentHistory from '$lib/components/payments/PaymentHistory.svelte';
</script>

<svelte:head>
  <title>Payment History</title>
  <meta name="description" content="View your past payment transactions." />
</svelte:head>

<div class="payment-history-page-container">
  <h1>Your Payment History</h1>
  <p>Below is a list of your past transactions.</p>

  <PaymentHistory />

  <div class="support-info">
    <p>
      If you have any questions about your payments or see any discrepancies,
      please <a href="/support">contact support</a>.
    </p>
  </div>
</div>

<style>
  .payment-history-page-container {
    max-width: 900px; /* Wider for table data */
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    text-align: center;
  }

  .support-info {
    margin-top: 2rem;
    font-size: 0.9em;
    color: #777;
    text-align: center;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  .support-info a {
    color: #007bff; /* Standard link blue */
    text-decoration: none;
  }
  .support-info a:hover {
    text-decoration: underline;
  }
</style>
