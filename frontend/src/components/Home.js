import React, { useState, useEffect } from 'react';
import { loanService } from '../services/api';

const Home = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await loanService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome to Bank Lending System</h2>
        <p>
          This system allows you to manage loans and payments efficiently. 
          Use the navigation menu to access different features:
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <div className="grid">
            <div className="stats-card">
              <div className="stats-number">LEND</div>
              <div className="stats-label">Create new loans for customers</div>
            </div>
            
            <div className="stats-card">
              <div className="stats-number">PAYMENT</div>
              <div className="stats-label">Record EMI and lump sum payments</div>
            </div>
            
            <div className="stats-card">
              <div className="stats-number">LEDGER</div>
              <div className="stats-label">View loan details and transaction history</div>
            </div>
            
            <div className="stats-card">
              <div className="stats-number">OVERVIEW</div>
              <div className="stats-label">Get customer account summary</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>System Features</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Simple Interest calculation (I = P × N × R / 100)</li>
            <li>Fixed monthly EMI based on total amount</li>
            <li>Support for both EMI and lump sum payments</li>
            <li>Complete transaction history tracking</li>
            <li>Automatic loan status management</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '4px', 
                     backgroundColor: apiStatus === 'connected' ? '#d4edda' : '#f8d7da',
                     border: `1px solid ${apiStatus === 'connected' ? '#c3e6cb' : '#f5c6cb'}`,
                     color: apiStatus === 'connected' ? '#155724' : '#721c24' }}>
          <strong>API Status:</strong> {
            apiStatus === 'checking' ? 'Checking connection...' :
            apiStatus === 'connected' ? 'Connected to backend service' :
            'Backend service unavailable. Please ensure the server is running on port 3001.'
          }
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Quick Start Guide</h3>
          <ol style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Start by creating a loan for a customer (CUST001, CUST002, or CUST003)</li>
            <li>Record payments against the loan using the loan ID</li>
            <li>Check the ledger to see transaction history</li>
            <li>Use customer overview to see all loans for a customer</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
