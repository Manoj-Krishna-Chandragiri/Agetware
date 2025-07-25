import React, { useState } from 'react';

const CaesarCipher = () => {
  const [message, setMessage] = useState('');
  const [shift, setShift] = useState(3);
  const [operation, setOperation] = useState('encode');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/caesar-cipher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          shift: parseInt(shift),
          operation
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
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
    setMessage('');
    setShift(3);
    setOperation('encode');
    setResult('');
  };

  return (
    <div className="component-container">
      <h2>🔐 Caesar Cipher Encoder/Decoder</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Transform messages using the ancient Caesar cipher technique with customizable shift values
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="message">Message to Transform:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter your secret message here... (e.g., 'Hello World')"
            rows="4"
            className="enhanced-textarea"
            maxLength="1000"
          />
          <div className="form-help">
            <span className="char-count">{message.length}/1000 characters</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="shift">Shift Value (1-25):</label>
          <div className="input-with-controls">
            <input
              type="range"
              id="shift-range"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              min="1"
              max="25"
              className="shift-slider"
            />
            <input
              type="number"
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              min="1"
              max="25"
              required
              className="enhanced-input shift-input"
            />
          </div>
          <div className="form-help">
            Caesar used a shift of 3. Try different values for different encryption strengths!
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="operation">Operation Mode:</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="operation"
                value="encode"
                checked={operation === 'encode'}
                onChange={(e) => setOperation(e.target.value)}
              />
              <span className="radio-label">🔒 Encode (Encrypt)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="operation"
                value="decode"
                checked={operation === 'decode'}
                onChange={(e) => setOperation(e.target.value)}
              />
              <span className="radio-label">🔓 Decode (Decrypt)</span>
            </label>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : `${operation.charAt(0).toUpperCase() + operation.slice(1)} Message`}
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
            <p><strong>Original:</strong> {message}</p>
            <p><strong>Shift:</strong> {shift}</p>
            <p><strong>Operation:</strong> {operation}</p>
            <p><strong>Result:</strong> {result}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaesarCipher;
