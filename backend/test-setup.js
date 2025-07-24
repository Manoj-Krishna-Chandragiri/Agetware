const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Database setup for testing
const db = new sqlite3.Database('./test_bank_lending.db');

// Test data
const testLoans = [
  {
    customer_id: 'CUST001',
    loan_amount: 100000,
    loan_period_years: 5,
    interest_rate_yearly: 10
  },
  {
    customer_id: 'CUST002',
    loan_amount: 50000,
    loan_period_years: 3,
    interest_rate_yearly: 8
  }
];

function initializeTestDatabase() {
  // Create tables
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        principal_amount DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL(15,2) NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
      )
    `);

    // Insert test customers
    db.run(`
      INSERT OR REPLACE INTO customers (customer_id, name) VALUES 
      ('CUST001', 'John Doe'),
      ('CUST002', 'Jane Smith'),
      ('CUST003', 'Bob Johnson')
    `);

    console.log('Test database initialized successfully');
  });
}

function calculateLoanDetails(principal, years, interestRate) {
  const totalInterest = principal * years * (interestRate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEmi = totalAmount / (years * 12);
  
  return {
    totalInterest,
    totalAmount,
    monthlyEmi: Math.round(monthlyEmi * 100) / 100
  };
}

function createTestLoans() {
  testLoans.forEach(loan => {
    const loanDetails = calculateLoanDetails(
      loan.loan_amount, 
      loan.loan_period_years, 
      loan.interest_rate_yearly
    );
    
    const loan_id = uuidv4();
    
    db.run(`
      INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                        interest_rate, loan_period_years, monthly_emi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      loan_id, 
      loan.customer_id, 
      loan.loan_amount, 
      loanDetails.totalAmount,
      loan.interest_rate_yearly, 
      loan.loan_period_years, 
      loanDetails.monthlyEmi
    ], function(err) {
      if (err) {
        console.error('Error creating test loan:', err);
      } else {
        console.log(`Test loan created: ${loan_id} for ${loan.customer_id}`);
        
        // Add some test payments
        const payment_id = uuidv4();
        db.run(`
          INSERT INTO payments (payment_id, loan_id, amount, payment_type)
          VALUES (?, ?, ?, ?)
        `, [payment_id, loan_id, loanDetails.monthlyEmi, 'EMI'], function(err) {
          if (err) {
            console.error('Error creating test payment:', err);
          } else {
            console.log(`Test payment created: ${payment_id}`);
          }
        });
      }
    });
  });
}

function runTests() {
  console.log('Initializing test database...');
  initializeTestDatabase();
  
  setTimeout(() => {
    console.log('Creating test loans...');
    createTestLoans();
    
    setTimeout(() => {
      console.log('Test data setup complete!');
      console.log('You can now test the API with the created loans.');
      db.close();
    }, 1000);
  }, 1000);
}

if (require.main === module) {
  runTests();
}

module.exports = {
  initializeTestDatabase,
  calculateLoanDetails,
  createTestLoans
};
