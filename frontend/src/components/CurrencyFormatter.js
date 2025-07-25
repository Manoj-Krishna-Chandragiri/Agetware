import React, { useState } from 'react';

const CurrencyFormatter = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/currency-format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: parseFloat(number)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setNumber('');
    setResult('');
  };

  const examples = [
    { input: '123456.7891', output: '1,23,456.7891' },
    { input: '1000000', output: '10,00,000' },
    { input: '50000.50', output: '50,000.50' },
    { input: '12345678.99', output: '1,23,45,678.99' }
  ];

  return (
    <div className="component-container">
      <h2>₹ Indian Currency Formatter</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Convert decimal numbers to Indian numbering system with lakhs and crores formatting
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="number">Enter Number to Format:</label>
          <div className="input-container">
            <span className="input-prefix">₹</span>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => {
                const value = e.target.value;
                // Allow numbers, decimal point, and basic formatting
                if (/^-?\d*\.?\d*$/.test(value) || value === '') {
                  setNumber(value);
                }
              }}
              required
              placeholder="Enter amount (e.g., 123456.78)"
              className="enhanced-input currency-input"
            />
          </div>
          <div className="form-help">
            Enter any decimal number. Examples: 123456.78, 1000000, 50000.50
          </div>
        </div>

        <div className="quick-examples">
          <label>Quick Examples:</label>
          <div className="example-buttons">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setNumber(example.input)}
                className="example-btn"
              >
                {example.input}
              </button>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Formatting...' : 'Format Currency'}
          </button>
          <button type="button" onClick={clearForm} className="secondary-button">
            Clear
          </button>
        </div>
      </form>

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          <div className="result-box">
            <p><strong>Original Number:</strong> {result.original_number}</p>
            <p><strong>Indian Format:</strong> {result.formatted_number}</p>
          </div>
        </div>
      )}

      <div className="examples-section">
        <h3>Examples:</h3>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <div key={index} className="example-item">
              <span className="example-input">{example.input}</span>
              <span className="arrow">→</span>
              <span className="example-output">{example.output}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyFormatter;
