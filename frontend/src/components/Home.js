import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <h2>🎯 Welcome to the Complete Banking & Programming Solution</h2>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '2rem', color: '#4a5568' }}>
          This comprehensive application combines a fully functional <strong>Bank Lending System</strong> with 
          solutions to <strong>4 challenging programming problems</strong>. Each module is designed with 
          professional-grade APIs and intuitive user interfaces.
        </p>
        
        <div className="banking-section">
          <h3>Loan Management System</h3>
          <div className="banking-grid">
            <Link to="/create-loan" className="banking-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="banking-number">LEND</div>
              <div className="banking-label">Create loans with interest calculation</div>
            </Link>
            
            <Link to="/record-payment" className="banking-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="banking-number">PAYMENT</div>
              <div className="banking-label">Record EMI and lump sum payments</div>
            </Link>
            
            <Link to="/view-ledger" className="banking-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="banking-number">LEDGER</div>
              <div className="banking-label">View complete transaction history</div>
            </Link>
            
            <Link to="/customer-overview" className="banking-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="banking-number">OVERVIEW</div>
              <div className="banking-label">Customer portfolio summary</div>
            </Link>
          </div>
        </div>

        <div className="assignment-section">
          <h3>Programming Challenges</h3>
          <div className="assignment-grid">
            <Link to="/caesar-cipher" className="assignment-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="assignment-icon">🔐</span>
              <div className="assignment-title">Caesar Cipher</div>
              <div className="assignment-description">Encode and decode messages using the classic Caesar shift cipher technique</div>
            </Link>
            
            <Link to="/currency-formatter" className="assignment-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="assignment-icon">₹</span>
              <div className="assignment-title">Indian Currency Format</div>
              <div className="assignment-description">Convert numbers to Indian numbering system with proper comma placement</div>
            </Link>
            
            <Link to="/list-combiner" className="assignment-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="assignment-icon">🔗</span>
              <div className="assignment-title">List Combiner</div>
              <div className="assignment-description">Merge position-based lists intelligently using overlap detection algorithms</div>
            </Link>
            
            <Link to="/minimizing-loss" className="assignment-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="assignment-icon">📉</span>
              <div className="assignment-title">Minimizing Loss</div>
              <div className="assignment-description">Find optimal buy and sell strategy to minimize financial losses</div>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#2d3748', textAlign: 'center', marginBottom: '1.5rem' }}>🔧 System Capabilities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ color: '#4facfe', marginBottom: '1rem' }}>Banking Features</h4>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>Simple Interest calculation (I = P × N × R / 100)</li>
                <li>Dynamic monthly EMI computation</li>
                <li>EMI and lump sum payment processing</li>
                <li>Complete transaction history tracking</li>
                <li>Real-time loan status management</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '1rem' }}> Programming Solutions</h4>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>Caesar cipher encryption/decryption algorithms</li>
                <li>Indian numbering system formatter</li>
                <li>Intelligent list merging with overlap detection</li>
                <li>Financial loss minimization calculator</li>
                <li>RESTful API design with comprehensive validation</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          background: apiStatus === 'connected' 
            ? 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)' 
            : apiStatus === 'checking'
            ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
            : 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {apiStatus === 'checking' ? '⏳' : apiStatus === 'connected' ? '✅' : '❌'}
          </div>
          <strong style={{ fontSize: '1.2rem' }}>API Connection Status</strong>
          <div style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
            {apiStatus === 'checking' ? 'Establishing connection...' :
             apiStatus === 'connected' ? 'All systems operational! Backend services running on port 3001' :
             'Connection failed. Please ensure the backend server is running.'}
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
          <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>Quick Start Guide</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ color: '#ffd700', marginBottom: '1rem' }}>Banking System</h4>
              <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Create loans for test customers (CUST001-003)</li>
                <li>Record payments using the generated loan ID</li>
                <li>View detailed ledger for transaction history</li>
                <li>Check customer overview for portfolio summary</li>
              </ol>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ color: '#ffd700', marginBottom: '1rem' }}>💻 Programming Challenges</h4>
              <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Test Caesar cipher with custom messages</li>
                <li>Format numbers in Indian currency style</li>
                <li>Combine lists with position-based overlap</li>
                <li>Calculate optimal loss scenarios</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
