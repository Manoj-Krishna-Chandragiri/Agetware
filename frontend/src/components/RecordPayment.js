import React, { useState } from 'react';
import { loanService } from '../services/api';

const RecordPayment = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const paymentData = {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      };

      const response = await loanService.recordPayment(formData.loan_id, paymentData);
      setResult(response.data);
      
      // Reset form
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Record Payment</h2>
        
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="alert alert-success">
            <strong>Payment Recorded Successfully!</strong>
            <br />
            <strong>Payment ID:</strong> {result.payment_id}
            <br />
            <strong>Loan ID:</strong> {result.loan_id}
            <br />
            <strong>Message:</strong> {result.message}
            <br />
            <strong>Remaining Balance:</strong> ₹{result.remaining_balance.toLocaleString()}
            <br />
            <strong>EMIs Left:</strong> {result.emis_left}
            {result.remaining_balance === 0 && (
              <div style={{ marginTop: '0.5rem', color: '#27ae60', fontWeight: 'bold' }}>
                🎉 Loan Fully Paid Off!
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loan_id">Loan ID:</label>
            <input
              type="text"
              id="loan_id"
              name="loan_id"
              value={formData.loan_id}
              onChange={handleChange}
              required
              placeholder="Enter the loan ID (UUID format)"
            />
            <small style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              You can get the loan ID from the loan creation response or ledger view
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Payment Amount (₹):</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              placeholder="Enter payment amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment_type">Payment Type:</label>
            <select
              id="payment_type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              required
            >
              <option value="EMI">EMI (Regular monthly payment)</option>
              <option value="LUMP_SUM">Lump Sum (Additional payment)</option>
            </select>
            <small style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              EMI: Regular monthly installment | Lump Sum: Extra payment to reduce outstanding balance
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Recording Payment...' : 'Record Payment'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Payment Information</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li><strong>EMI Payments:</strong> Fixed monthly installments that go towards paying off the loan</li>
            <li><strong>Lump Sum Payments:</strong> Additional payments that reduce the outstanding balance and decrease remaining EMIs</li>
            <li><strong>Overpayment Protection:</strong> Payments cannot exceed the remaining loan balance</li>
            <li><strong>Automatic Calculation:</strong> The system automatically calculates remaining balance and EMIs left</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecordPayment;
