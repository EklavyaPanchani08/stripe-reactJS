import React, { useState } from 'react';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleSubscription = async (plan) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, ...formData }),
      });

      const data = await response.json();
      console.log("👀 ⇒ file: Subscription.js:20 ⇒ handleSubscription ⇒ data:", data)
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Subscription Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="subscription-container">
      <h2 className="title">Select a Subscription Plan</h2>
      <h3 className="subtitle">User Details</h3>

      <input
        className="input-field"
        placeholder="Enter Your Name"
        type="text"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        value={formData.name}
      />
      <input
        className="input-field"
        placeholder="Enter Your Email"
        type="email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        value={formData.email}
      />

      <div className="button-group">
        <button
          className="subscribe-button"
          onClick={() => handleSubscription("30-days")}
          disabled={loading}
        >
          Subscribe for 30 Days ($500)
        </button>
        <button
          className="subscribe-button"
          onClick={() => handleSubscription("60-days")}
          disabled={loading}
        >
          Subscribe for 60 Days ($900)
        </button>
        <button
          className="subscribe-button"
          onClick={() => handleSubscription("90-days")}
          disabled={loading}
        >
          Subscribe for 90 Days ($1200)
        </button>
      </div>
    </div>
  );
};

export default Subscription;