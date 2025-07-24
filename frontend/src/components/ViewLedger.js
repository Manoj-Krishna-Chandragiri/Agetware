import React, { useState } from 'react';
import { loanService } from '../services/api';

const ViewLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLedger(null);

    try {
      const response = await loanService.getLoanLedger(loanId);
      setLedger(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch loan ledger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div>
      <div className="card">
        <h2>View Loan Ledger</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loan_id">Loan ID:</label>
            <input
              type="text"
              id="loan_id"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              required
              placeholder="Enter the loan ID (UUID format)"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading Ledger...' : 'View Ledger'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {ledger && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Loan Details</h3>
            
            <div className="grid" style={{ marginTop: '1rem' }}>
              <div className="stats-card">
                <div className="stats-number">{formatCurrency(ledger.principal)}</div>
                <div className="stats-label">Principal Amount</div>
              </div>
              
              <div className="stats-card">
                <div className="stats-number">{formatCurrency(ledger.total_amount)}</div>
                <div className="stats-label">Total Amount</div>
              </div>
              
              <div className="stats-card">
                <div className="stats-number">{formatCurrency(ledger.monthly_emi)}</div>
                <div className="stats-label">Monthly EMI</div>
              </div>
              
              <div className="stats-card">
                <div className="stats-number">{ledger.emis_left}</div>
                <div className="stats-label">EMIs Left</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: ledger.balance_amount === 0 ? '#d4edda' : '#e8f4f8', 
              borderRadius: '4px',
              border: `1px solid ${ledger.balance_amount === 0 ? '#c3e6cb' : '#bee5eb'}`
            }}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div>
                  <strong>Loan ID:</strong><br />
                  <span style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{ledger.loan_id}</span>
                </div>
                <div>
                  <strong>Customer ID:</strong><br />
                  {ledger.customer_id}
                </div>
                <div>
                  <strong>Amount Paid:</strong><br />
                  {formatCurrency(ledger.amount_paid)}
                </div>
                <div>
                  <strong>Balance Amount:</strong><br />
                  <span style={{ 
                    color: ledger.balance_amount === 0 ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {formatCurrency(ledger.balance_amount)}
                    {ledger.balance_amount === 0 && ' ✓ PAID OFF'}
                  </span>
                </div>
              </div>
            </div>

            {ledger.transactions && ledger.transactions.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3>Transaction History</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>{formatDate(transaction.date)}</td>
                          <td style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                            {transaction.transaction_id}
                          </td>
                          <td>{formatCurrency(transaction.amount)}</td>
                          <td>
                            <span style={{ 
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              backgroundColor: transaction.type === 'EMI' ? '#e8f4f8' : '#fff3cd',
                              color: transaction.type === 'EMI' ? '#0c5460' : '#856404',
                              border: `1px solid ${transaction.type === 'EMI' ? '#bee5eb' : '#ffeaa7'}`
                            }}>
                              {transaction.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
                  <strong>Total Transactions:</strong> {ledger.transactions.length} | 
                  <strong> Total Amount Paid:</strong> {formatCurrency(ledger.amount_paid)}
                </div>
              </div>
            )}

            {(!ledger.transactions || ledger.transactions.length === 0) && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '2rem', 
                textAlign: 'center', 
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                color: '#6c757d'
              }}>
                <strong>No transactions recorded yet</strong>
                <br />
                <small>Use the "Record Payment" feature to add payments to this loan</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLedger;
