// PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    // Call backend to create a PaymentIntent
    const res = await fetch('http://localhost:4000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }), // example amount in cents
    });
    const { clientSecret } = await res.json();

    // Confirm the card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2 className="title">Direct Payment</h2>
      <div className="card-element-container">
        <CardElement className="card-input" />
      </div>
      <button className="subscribe-button" type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Pay"}
      </button>
      {message && <div className="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentForm;
