import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateLoan from './components/CreateLoan';
import RecordPayment from './components/RecordPayment';
import ViewLedger from './components/ViewLedger';
import CustomerOverview from './components/CustomerOverview';
import Home from './components/Home';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Bank Lending System</h1>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <ul className="nav-list">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/create-loan" 
                className={`nav-link ${location.pathname === '/create-loan' ? 'active' : ''}`}
              >
                Create Loan
              </Link>
            </li>
            <li>
              <Link 
                to="/record-payment" 
                className={`nav-link ${location.pathname === '/record-payment' ? 'active' : ''}`}
              >
                Record Payment
              </Link>
            </li>
            <li>
              <Link 
                to="/view-ledger" 
                className={`nav-link ${location.pathname === '/view-ledger' ? 'active' : ''}`}
              >
                View Ledger
              </Link>
            </li>
            <li>
              <Link 
                to="/customer-overview" 
                className={`nav-link ${location.pathname === '/customer-overview' ? 'active' : ''}`}
              >
                Customer Overview
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-loan" element={<CreateLoan />} />
          <Route path="/record-payment" element={<RecordPayment />} />
          <Route path="/view-ledger" element={<ViewLedger />} />
          <Route path="/customer-overview" element={<CustomerOverview />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
