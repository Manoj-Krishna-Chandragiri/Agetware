import React, { useState } from 'react';
import { loanService } from '../services/api';

const CustomerOverview = () => {
  const [customerId, setCustomerId] = useState('CUST001');
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOverview(null);

    try {
      const response = await loanService.getCustomerOverview(customerId);
      setOverview(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch customer overview');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const calculateTotals = () => {
    if (!overview || !overview.loans) return null;

    const totals = overview.loans.reduce((acc, loan) => {
      return {
        totalPrincipal: acc.totalPrincipal + loan.principal,
        totalAmount: acc.totalAmount + loan.total_amount,
        totalInterest: acc.totalInterest + loan.total_interest,
        totalPaid: acc.totalPaid + loan.amount_paid,
        totalOutstanding: acc.totalOutstanding + (loan.total_amount - loan.amount_paid)
      };
    }, {
      totalPrincipal: 0,
      totalAmount: 0,
      totalInterest: 0,
      totalPaid: 0,
      totalOutstanding: 0
    });

    return totals;
  };

  const totals = calculateTotals();

  const getCustomerName = (id) => {
    const customers = {
      'CUST001': 'John Doe',
      'CUST002': 'Jane Smith',
      'CUST003': 'Bob Johnson'
    };
    return customers[id] || id;
  };

  return (
    <div>
      <div className="card">
        <h2>Customer Account Overview</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_id">Customer:</label>
            <select
              id="customer_id"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="CUST001">CUST001 - John Doe</option>
              <option value="CUST002">CUST002 - Jane Smith</option>
              <option value="CUST003">CUST003 - Bob Johnson</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading Overview...' : 'Get Overview'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {overview && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#e8f4f8', 
              borderRadius: '4px',
              marginBottom: '2rem'
            }}>
              <h3>Customer: {getCustomerName(overview.customer_id)}</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d' }}>
                Customer ID: {overview.customer_id} | Total Loans: {overview.total_loans}
              </p>
            </div>

            {totals && (
              <div>
                <h3>Portfolio Summary</h3>
                <div className="grid" style={{ marginTop: '1rem' }}>
                  <div className="stats-card">
                    <div className="stats-number">{formatCurrency(totals.totalPrincipal)}</div>
                    <div className="stats-label">Total Principal</div>
                  </div>
                  
                  <div className="stats-card">
                    <div className="stats-number">{formatCurrency(totals.totalInterest)}</div>
                    <div className="stats-label">Total Interest</div>
                  </div>
                  
                  <div className="stats-card">
                    <div className="stats-number">{formatCurrency(totals.totalPaid)}</div>
                    <div className="stats-label">Amount Paid</div>
                  </div>
                  
                  <div className="stats-card">
                    <div className="stats-number">{formatCurrency(totals.totalOutstanding)}</div>
                    <div className="stats-label">Outstanding Balance</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <h3>Loan Details</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Principal</th>
                      <th>Total Amount</th>
                      <th>Interest</th>
                      <th>Monthly EMI</th>
                      <th>Amount Paid</th>
                      <th>EMIs Left</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.loans.map((loan, index) => (
                      <tr key={index}>
                        <td style={{ fontSize: '0.8rem', wordBreak: 'break-all', maxWidth: '120px' }}>
                          {loan.loan_id}
                        </td>
                        <td>{formatCurrency(loan.principal)}</td>
                        <td>{formatCurrency(loan.total_amount)}</td>
                        <td>{formatCurrency(loan.total_interest)}</td>
                        <td>{formatCurrency(loan.emi_amount)}</td>
                        <td>{formatCurrency(loan.amount_paid)}</td>
                        <td>{loan.emis_left}</td>
                        <td>
                          <span style={{ 
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            backgroundColor: loan.emis_left === 0 ? '#d4edda' : '#fff3cd',
                            color: loan.emis_left === 0 ? '#155724' : '#856404',
                            border: `1px solid ${loan.emis_left === 0 ? '#c3e6cb' : '#ffeaa7'}`
                          }}>
                            {loan.emis_left === 0 ? 'PAID OFF' : 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px' 
            }}>
              <h4>Account Summary</h4>
              <div style={{ marginTop: '1rem' }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div>
                    <strong>Active Loans:</strong><br />
                    {overview.loans.filter(loan => loan.emis_left > 0).length}
                  </div>
                  <div>
                    <strong>Completed Loans:</strong><br />
                    {overview.loans.filter(loan => loan.emis_left === 0).length}
                  </div>
                  <div>
                    <strong>Payment Progress:</strong><br />
                    {totals.totalAmount > 0 ? 
                      `${Math.round((totals.totalPaid / totals.totalAmount) * 100)}%` : 
                      '0%'
                    }
                  </div>
                  <div>
                    <strong>Remaining EMIs:</strong><br />
                    {overview.loans.reduce((sum, loan) => sum + loan.emis_left, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOverview;
