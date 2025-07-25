import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateLoan from './components/CreateLoan';
import RecordPayment from './components/RecordPayment';
import ViewLedger from './components/ViewLedger';
import CustomerOverview from './components/CustomerOverview';
import CaesarCipher from './components/CaesarCipher';
import CurrencyFormatter from './components/CurrencyFormatter';
import ListCombiner from './components/ListCombiner';
import MinimizingLoss from './components/MinimizingLoss';
import Home from './components/Home';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Bank Lending System + Programming Challenges </h1>
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
            <li className="nav-divider">• Programming Challenges •</li>
            <li>
              <Link 
                to="/caesar-cipher" 
                className={`nav-link ${location.pathname === '/caesar-cipher' ? 'active' : ''}`}
              >
                🔐 Caesar Cipher
              </Link>
            </li>
            <li>
              <Link 
                to="/currency-formatter" 
                className={`nav-link ${location.pathname === '/currency-formatter' ? 'active' : ''}`}
              >
                ₹ Currency Format
              </Link>
            </li>
            <li>
              <Link 
                to="/list-combiner" 
                className={`nav-link ${location.pathname === '/list-combiner' ? 'active' : ''}`}
              >
                🔗 List Combiner
              </Link>
            </li>
            <li>
              <Link 
                to="/minimizing-loss" 
                className={`nav-link ${location.pathname === '/minimizing-loss' ? 'active' : ''}`}
              >
                📉 Minimizing Loss
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
          <Route path="/caesar-cipher" element={<CaesarCipher />} />
          <Route path="/currency-formatter" element={<CurrencyFormatter />} />
          <Route path="/list-combiner" element={<ListCombiner />} />
          <Route path="/minimizing-loss" element={<MinimizingLoss />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
