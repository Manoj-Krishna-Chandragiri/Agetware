import React, { useState } from 'react';
import { loanService } from '../services/api';

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    customer_id: 'CUST001',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
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

  const calculatePreview = () => {
    const { loan_amount, loan_period_years, interest_rate_yearly } = formData;
    
    if (!loan_amount || !loan_period_years || !interest_rate_yearly) {
      return null;
    }

    const principal = parseFloat(loan_amount);
    const years = parseInt(loan_period_years);
    const rate = parseFloat(interest_rate_yearly);

    const totalInterest = principal * years * (rate / 100);
    const totalAmount = principal + totalInterest;
    const monthlyEmi = totalAmount / (years * 12);

    return {
      principal,
      totalInterest,
      totalAmount,
      monthlyEmi: Math.round(monthlyEmi * 100) / 100
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const loanData = {
        customer_id: formData.customer_id,
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseInt(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
      };

      const response = await loanService.createLoan(loanData);
      setResult(response.data);
      
      // Reset form
      setFormData({
        customer_id: 'CUST001',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Create New Loan</h2>
        
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="alert alert-success">
            <strong>Loan Created Successfully!</strong>
            <br />
            <strong>Loan ID:</strong> {result.loan_id}
            <br />
            <strong>Customer ID:</strong> {result.customer_id}
            <br />
            <strong>Total Amount Payable:</strong> ₹{result.total_amount_payable.toLocaleString()}
            <br />
            <strong>Monthly EMI:</strong> ₹{result.monthly_emi.toLocaleString()}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_id">Customer ID:</label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              <option value="CUST001">CUST001 - John Doe</option>
              <option value="CUST002">CUST002 - Jane Smith</option>
              <option value="CUST003">CUST003 - Bob Johnson</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="loan_amount">Loan Amount (₹):</label>
            <input
              type="number"
              id="loan_amount"
              name="loan_amount"
              value={formData.loan_amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
              placeholder="Enter loan amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loan_period_years">Loan Period (Years):</label>
            <input
              type="number"
              id="loan_period_years"
              name="loan_period_years"
              value={formData.loan_period_years}
              onChange={handleChange}
              min="1"
              max="30"
              required
              placeholder="Enter loan period in years"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest_rate_yearly">Interest Rate (% per year):</label>
            <input
              type="number"
              id="interest_rate_yearly"
              name="interest_rate_yearly"
              value={formData.interest_rate_yearly}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="Enter annual interest rate"
            />
          </div>

          {preview && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#e8f4f8', 
              borderRadius: '4px',
              border: '1px solid #bee5eb'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#0c5460' }}>Loan Calculation Preview</h3>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                  <strong>Principal Amount:</strong><br />
                  ₹{preview.principal.toLocaleString()}
                </div>
                <div>
                  <strong>Total Interest:</strong><br />
                  ₹{preview.totalInterest.toLocaleString()}
                </div>
                <div>
                  <strong>Total Amount:</strong><br />
                  ₹{preview.totalAmount.toLocaleString()}
                </div>
                <div>
                  <strong>Monthly EMI:</strong><br />
                  ₹{preview.monthlyEmi.toLocaleString()}
                </div>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
                <strong>Formula:</strong> Simple Interest = P × N × R / 100<br />
                <strong>EMI:</strong> (Principal + Total Interest) / (Years × 12)
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Creating Loan...' : 'Create Loan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;
