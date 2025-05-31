import React, { useState } from 'react';

// Assume Stripe.js is loaded, and you have access to the `stripe` object.
// In a real app, you'd use @stripe/react-stripe-js for this.
// declare var stripe: any; // Placeholder for Stripe object

// Basic styling - in a real app, this would likely be in a CSS file or a styling solution
const styles = {
  form: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold' as 'bold',
  },
  input: {
    width: 'calc(100% - 22px)', // Adjust for padding and border
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
  },
  button: {
    padding: '12px 25px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#28a745', // Green color for Pay button
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#6c757d', // Gray when disabled
    cursor: 'not-allowed',
  },
  placeholderText: {
    fontStyle: 'italic' as 'italic',
    color: '#777',
    marginBottom: '15px',
    padding: '10px',
    border: '1px dashed #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    textAlign: 'center' as 'center',
  },
  apiCallComment: {
    fontSize: '0.9em',
    color: '#555',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center' as 'center',
  }
};

interface CheckoutFormProps {
  selectedPlan?: { id: string; name: string; price: number }; // Example, adjust as needed
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPlan }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // In a real application, you would get the stripe object from @stripe/react-stripe-js
  // const stripe = useStripe();
  // const elements = useElements();

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    // if (!stripe || !elements) {
    //   // Stripe.js has not yet loaded.
    //   // Make sure to disable form submission until Stripe.js has loaded.
    //   setPaymentError("Stripe.js has not loaded yet. Please try again in a moment.");
    //   setIsLoading(false);
    //   return;
    // }

    // const cardElement = elements.getElement(CardElement); // Assuming you're using CardElement
    // if (!cardElement) {
    //   setPaymentError("Card details are not valid.");
    //   setIsLoading(false);
    //   return;
    // }

    // --- Step 1: Create a PaymentIntent on your backend ---
    let clientSecret: string;
    try {
      // Replace '/api/payments/create-intent' with your actual backend endpoint.
      // Send any necessary data, like item ID, amount, currency, etc.
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Example: use selectedPlan if passed, or a default/derived amount
          amount: selectedPlan ? selectedPlan.price * 100 : 5000, // Amount in cents
          currency: 'usd',
          email: email, // Optionally send email for receipt or customer creation
          planId: selectedPlan?.id, // Optional: send plan ID
          // Add any other relevant details your backend needs
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent.');
      }

      const paymentIntentData = await response.json();
      clientSecret = paymentIntentData.clientSecret;

    } catch (error: any) {
      console.error("Error creating PaymentIntent:", error);
      setPaymentError(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
      return;
    }

    // --- Step 2: Confirm the payment on the frontend with Stripe.js ---
    // This uses the clientSecret from the PaymentIntent and the CardElement.
    alert(`Conceptual: Payment processing would start now using clientSecret: ${clientSecret.substring(0,20)}...`);
    // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: cardElement,
    //     billing_details: {
    //       email: email,
    //       // name: 'Jenny Rosen', // Optional: collect name
    //     },
    //   },
    // });

    // if (stripeError) {
    //   console.error("Stripe payment confirmation error:", stripeError);
    //   setPaymentError(stripeError.message || "Payment failed. Please check your card details.");
    //   setIsLoading(false);
    //   return;
    // }

    // if (paymentIntent && paymentIntent.status === 'succeeded') {
    //   console.log("Payment Succeeded:", paymentIntent);
    //   setPaymentSuccess(true);
    //   // Potentially redirect to a success page or show a success message.
    //   alert('Payment Succeeded! (Conceptual)');
    // } else {
    //   setPaymentError(paymentIntent ? `Payment status: ${paymentIntent.status}` : "Payment did not succeed.");
    // }

    // Simulate a delay for conceptual payment processing
    setTimeout(() => {
      // Simulate success for now
      console.log("Conceptual Payment Succeeded for plan:", selectedPlan?.name || "default item");
      setPaymentSuccess(true);
      alert('Payment Succeeded! (Conceptual)');
      setIsLoading(false);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div style={{ ...styles.form, textAlign: 'center' as 'center' }}>
        <h2 style={{ color: '#28a745' }}>Payment Successful!</h2>
        <p>Thank you for your purchase{selectedPlan ? ` of ${selectedPlan.name}` : ''}.</p>
        <p>A confirmation email has been sent to {email}.</p>
      </div>
    );
  }

  return (
    <form style={styles.form} onSubmit={handlePaymentSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {selectedPlan ? `Checkout: ${selectedPlan.name}` : "Checkout"}
      </h2>

      <div style={styles.placeholderText}>
        {/* This is where Stripe's CardElement would be mounted. */}
        {/* For example: <CardElement options={{style: {...}}} /> */}
        <strong>Stripe Card Element Placeholder</strong>
        <p style={{fontSize: '0.9em', color: '#666'}}>(Secure card input field managed by Stripe.js)</p>
      </div>

      <div>
        <label htmlFor="email" style={styles.label}>Email Address for Receipt</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        style={isLoading ? {...styles.button, ...styles.disabledButton} : styles.button}
        disabled={isLoading}
        onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#218838'; }}
        onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#28a745'; }}
      >
        {isLoading ? 'Processing...' : `Pay ${selectedPlan ? `$${selectedPlan.price}` : ''}`}
      </button>

      {paymentError && <p style={styles.errorText}>{paymentError}</p>}

      <div style={styles.apiCallComment}>
        <strong>Stripe Payment Flow:</strong>
        <ol>
          <li>User fills out their email (and card details in the Stripe Element above).</li>
          <li>User clicks "Pay Now".</li>
          <li>
            <strong>Backend Call:</strong> The <code>handlePaymentSubmit</code> function calls our backend (e.g., <code>POST /api/payments/create-intent</code>), sending payment details like amount, currency, and email.
          </li>
          <li>
            <strong>PaymentIntent Creation:</strong> The backend uses the Stripe SDK to create a PaymentIntent with Stripe's servers. This intent represents the transaction. Stripe returns a unique <code>client_secret</code> for this PaymentIntent to our backend.
          </li>
          <li>
            <strong>Client Secret to Frontend:</strong> The backend sends this <code>client_secret</code> back to the frontend.
          </li>
          <li>
            <strong>Stripe.js Confirmation:</strong> The frontend uses Stripe.js's <code>stripe.confirmCardPayment(clientSecret, {{'{payment_method: ...}'}})</code> function. This function securely sends the card details (collected by the Card Element) and the <code>client_secret</code> directly to Stripe's servers to confirm the payment.
          </li>
          <li>
            <strong>Payment Result:</strong> Stripe processes the payment. The frontend receives a success or error response.
          </li>
          <li>Update UI to show success message or error.</li>
        </ol>
        <p style={{fontSize: '0.85em', marginTop: '10px'}}>
          <em>Note: The actual Stripe Element and <code>stripe.confirmCardPayment</code> call are commented out in this placeholder. This component demonstrates the flow.</em>
        </p>
      </div>
       <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#777', textAlign: 'center' as 'center' }}>
        Note: This component structure was created/refined as part of a task.
      </p>
    </form>
  );
};

export default CheckoutForm;
