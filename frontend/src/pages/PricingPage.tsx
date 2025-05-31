import React from 'react';

// Basic styling - in a real app, this would likely be in a CSS file or a styling solution
const styles = {
  page: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center' as React.CSSProperties['textAlign'],
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '40px',
    color: '#333',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap' as React.CSSProperties['flexWrap'],
  },
  optionCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '30px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  optionTitle: {
    fontSize: '1.8em',
    marginBottom: '15px',
    color: '#555',
  },
  optionPrice: {
    fontSize: '1.5em',
    color: '#007bff',
    marginBottom: '25px',
  },
  optionButton: {
    padding: '12px 25px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  // Add a hover effect for the button style
  // optionButtonHover: {
  //   backgroundColor: '#0056b3',
  // }
};

const PricingPage: React.FC = () => {
  const handleChoosePlan = (planName: string) => {
    // Placeholder action
    alert(`You chose the ${planName}! (Functionality to be implemented)`);
    // In a real app, this might navigate to a checkout page with the selected plan
    // e.g., history.push(`/checkout?plan=${planName}`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Choose Your Plan</h1>
      <div style={styles.optionsContainer}>
        <div style={styles.optionCard}>
          <h2 style={styles.optionTitle}>Homeschool Plan</h2>
          <p style={styles.optionPrice}>$49.99/month</p>
          <p>Access for the entire family. Includes all subjects and levels. Personalized learning paths for each child.</p>
          <button
            style={styles.optionButton}
            onClick={() => handleChoosePlan('Homeschool Plan')}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Choose Plan
          </button>
        </div>
        <div style={styles.optionCard}>
          <h2 style={styles.optionTitle}>Individual Plan</h2>
          <p style={styles.optionPrice}>$39.99/month</p>
          <p>Perfect for a single learner. Full access to all course materials and interactive exercises.</p>
          <button
            style={styles.optionButton}
            onClick={() => handleChoosePlan('Individual Plan')}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Choose Plan
          </button>
        </div>
      </div>
      <p style={{ marginTop: '40px', fontSize: '0.9em', color: '#777' }}>
        Note: This frontend structure (including this page) was created as part of a task, as the original frontend directories were not found.
      </p>
    </div>
  );
};

export default PricingPage;
