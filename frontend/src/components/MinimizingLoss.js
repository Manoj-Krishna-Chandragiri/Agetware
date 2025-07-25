import React, { useState } from 'react';
import api from '../services/api';

const MinimizingLoss = () => {
  const [prices, setPrices] = useState('20,15,7,2,13');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse prices from comma-separated string
      const priceArray = prices.split(',').map(price => parseFloat(price.trim()));
      
      // Validate prices
      if (priceArray.some(isNaN)) {
        throw new Error('All prices must be valid numbers');
      }

      const response = await api.minimizeLoss({
        prices: priceArray
      });

      setResult(response.data);
    } catch (error) {
      console.error('Minimizing loss error:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPrices('20,15,7,2,13');
    setResult('');
  };

  const loadExample = () => {
    setPrices('100,80,60,40,30,50');
  };

  return (
    <div className="component-container">
      <h2>📉 Financial Loss Minimization Calculator</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Find the optimal buy and sell strategy to minimize financial losses in declining markets
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="prices">House Prices by Year:</label>
          <div className="prices-input-container">
            <textarea
              id="prices"
              value={prices}
              onChange={(e) => setPrices(e.target.value)}
              required
              placeholder="20, 15, 7, 2, 13"
              rows="3"
              className="enhanced-textarea prices-textarea"
            />
            <div className="price-count">
              <span>Years: {prices.split(',').filter(p => p.trim()).length}</span>
            </div>
          </div>
          <div className="form-help">
            Enter prices separated by commas. Each price represents the house value in that year.
          </div>
        </div>

        <div className="price-preview">
          <label>Price Preview:</label>
          <div className="preview-grid">
            {prices.split(',').map((price, index) => {
              const trimmedPrice = price.trim();
              const isValid = !isNaN(trimmedPrice) && trimmedPrice !== '';
              return (
                <div 
                  key={index} 
                  className={`preview-item ${isValid ? 'valid' : 'invalid'}`}
                >
                  <span className="year-label">Year {index + 1}</span>
                  <span className="price-value">
                    {isValid ? `₹${trimmedPrice}` : 'Invalid'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="preset-examples">
          <label>Quick Examples:</label>
          <div className="preset-buttons">
            <button
              type="button"
              onClick={() => setPrices('20,15,7,2,13')}
              className="preset-btn"
            >
              📉 Classic Example
            </button>
            <button
              type="button"
              onClick={() => setPrices('100,80,60,40,30,50')}
              className="preset-btn"
            >
              📊 Recovery Scenario
            </button>
            <button
              type="button"
              onClick={() => setPrices('50,45,40,35,30,25,20')}
              className="preset-btn"
            >
              📉 Steady Decline
            </button>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Find Minimum Loss'}
          </button>
          <button type="button" onClick={loadExample} className="secondary-button">
            Load Example
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
            <div className="prices-display">
              <h4>House Prices by Year:</h4>
              <div className="prices-grid">
                {result.prices.map((price, index) => (
                  <div 
                    key={index} 
                    className={`price-item ${
                      index + 1 === result.buy_year ? 'buy-year' : 
                      index + 1 === result.sell_year ? 'sell-year' : ''
                    }`}
                  >
                    <span className="year">Year {index + 1}</span>
                    <span className="price">₹{price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {result.buy_year && result.sell_year ? (
              <div className="recommendation">
                <h4>Optimal Strategy:</h4>
                <p><strong>Buy in Year {result.buy_year}</strong> at price ₹{result.prices[result.buy_year - 1]}</p>
                <p><strong>Sell in Year {result.sell_year}</strong> at price ₹{result.prices[result.sell_year - 1]}</p>
                <p><strong>Minimum Loss:</strong> ₹{result.minimum_loss}</p>
                <p className="strategy-note">{result.message}</p>
              </div>
            ) : (
              <div className="no-loss">
                <p>No profitable loss scenario found with the given prices.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="example-section">
        <h3>Example:</h3>
        <p>For prices [20, 15, 7, 2, 13]:</p>
        <ul>
          <li>Buy in Year 2 at ₹15</li>
          <li>Sell in Year 5 at ₹13</li>
          <li>Minimum Loss: ₹2</li>
        </ul>
      </div>
    </div>
  );
};

export default MinimizingLoss;
