<script lang="ts">
  import { onMount } from 'svelte';

  type Payment = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: string; // Should be a parsable date string
    description?: string;
  };

  let payments: Payment[] = [];
  let isLoading: boolean = true;
  let errorMessage: string = '';

  onMount(async () => {
    await fetchPaymentHistory();
  });

  async function fetchPaymentHistory() {
    isLoading = true;
    errorMessage = '';
    try {
      // TODO: Replace with the actual backend endpoint once created
      const response = await fetch('/api/v1/payments/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error fetching payment history: ${response.statusText}`);
      }

      const data = await response.json();
      payments = data.payments.map((p: any) => ({
        ...p,
        amount: p.amount / 100, // Assuming amount is in cents from backend
        date: new Date(p.created_at || p.date).toLocaleDateString(), // Adjust field name as per backend response
      }));

    } catch (e: any) {
      console.error('Failed to fetch payment history:', e);
      errorMessage = e.message || 'An unexpected error occurred while fetching payment history.';
      payments = []; // Clear payments on error
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="payment-history-container">
  <h2>Payment History</h2>

  {#if isLoading}
    <p>Loading payment history...</p>
  {:else if errorMessage}
    <p class="error-message">{errorMessage}</p>
    <button on:click={fetchPaymentHistory}>Try Again</button>
  {:else if payments.length === 0}
    <p>You have no payment history.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Date</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {#each payments as payment (payment.id)}
          <tr>
            <td>{payment.id.substring(0, 15)}...</td>
            <td>{payment.amount.toFixed(2)}</td>
            <td>{payment.currency.toUpperCase()}</td>
            <td class="status" class:succeeded={payment.status === 'succeeded'} class:failed={payment.status === 'failed'} class:pending={payment.status === 'pending' || payment.status === 'requires_action'}>
              {payment.status}
            </td>
            <td>{payment.date}</td>
            <td>{payment.description || '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .payment-history-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  .error-message {
    color: #D8000C; /* Standard error red */
    background-color: #FFD2D2; /* Light red background */
    border: 1px solid #D8000C;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  .status {
    font-weight: bold;
  }
  .status.succeeded {
    color: green;
  }
  .status.failed {
    color: red;
  }
  .status.pending {
    color: orange;
  }
</style>
