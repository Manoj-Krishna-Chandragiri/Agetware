const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./bank_lending.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Loans table
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

    // Create Payments table
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

    // Insert sample customers for testing
    db.run(`
      INSERT OR IGNORE INTO customers (customer_id, name) VALUES 
      ('CUST001', 'Manoj Krishna'),
      ('CUST002', 'Priya Sharma'),
      ('CUST003', 'Arjun Patel')
    `);
  });
}

// Utility functions
function calculateLoanDetails(principal, years, interestRate) {
  const totalInterest = principal * years * (interestRate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEmi = totalAmount / (years * 12);
  
  return {
    totalInterest,
    totalAmount,
    monthlyEmi: Math.round(monthlyEmi * 100) / 100 // Round to 2 decimal places
  };
}

// Caesar Cipher utility functions
function caesarEncode(message, shift) {
  return message.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
}

function caesarDecode(message, shift) {
  return caesarEncode(message, -shift);
}

// Indian Currency Format utility function
function formatIndianCurrency(number) {
  const [integerPart, decimalPart] = number.toString().split('.');
  let formattedInteger = '';
  
  // Handle the last 3 digits
  if (integerPart.length <= 3) {
    formattedInteger = integerPart;
  } else {
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);
    
    // Add commas every 2 digits from right to left for the remaining part
    let formatted = '';
    for (let i = remaining.length - 1; i >= 0; i -= 2) {
      const chunk = i === 0 ? remaining.slice(0, 1) : remaining.slice(Math.max(0, i - 1), i + 1);
      formatted = chunk + (formatted ? ',' + formatted : '');
    }
    
    formattedInteger = formatted + ',' + lastThree;
  }
  
  return decimalPart ? formattedInteger + '.' + decimalPart : formattedInteger;
}

// List Combiner utility function
function combineLists(list1, list2) {
  const combined = [...list1, ...list2];
  
  // Sort by left position
  combined.sort((a, b) => a.positions[0] - b.positions[0]);
  
  const result = [];
  
  for (let i = 0; i < combined.length; i++) {
    const current = combined[i];
    let merged = false;
    
    for (let j = 0; j < result.length; j++) {
      const existing = result[j];
      
      // Check if more than half of current is contained within existing
      const currentWidth = current.positions[1] - current.positions[0];
      const existingWidth = existing.positions[1] - existing.positions[0];
      
      const overlapStart = Math.max(current.positions[0], existing.positions[0]);
      const overlapEnd = Math.min(current.positions[1], existing.positions[1]);
      const overlap = Math.max(0, overlapEnd - overlapStart);
      
      if (overlap > currentWidth / 2 || overlap > existingWidth / 2) {
        // Merge values
        existing.values = [...existing.values, ...current.values];
        merged = true;
        break;
      }
    }
    
    if (!merged) {
      result.push({
        positions: [...current.positions],
        values: [...current.values]
      });
    }
  }
  
  // Sort result by left position
  return result.sort((a, b) => a.positions[0] - b.positions[0]);
}

// Minimizing Loss utility function
function findMinimumLoss(prices) {
  let minLoss = Infinity;
  let buyYear = -1;
  let sellYear = -1;
  
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[i] > prices[j]) {
        const loss = prices[i] - prices[j];
        if (loss < minLoss) {
          minLoss = loss;
          buyYear = i + 1; // Convert to 1-based year
          sellYear = j + 1; // Convert to 1-based year
        }
      }
    }
  }
  
  return {
    buyYear,
    sellYear,
    loss: minLoss === Infinity ? 0 : minLoss
  };
}

// API Routes

// 1. LEND: Create a new loan
app.post('/api/v1/loans', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  // Validation
  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({
      error: 'Missing required fields: customer_id, loan_amount, loan_period_years, interest_rate_yearly'
    });
  }

  if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly < 0) {
    return res.status(400).json({
      error: 'Invalid values: amounts and periods must be positive'
    });
  }

  // Check if customer exists
  db.get('SELECT customer_id FROM customers WHERE customer_id = ?', [customer_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(400).json({ error: 'Customer not found' });
    }

    // Calculate loan details
    const loanDetails = calculateLoanDetails(loan_amount, loan_period_years, interest_rate_yearly);
    const loan_id = uuidv4();

    // Insert loan into database
    const insertLoan = `
      INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, 
                        interest_rate, loan_period_years, monthly_emi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertLoan, [
      loan_id, customer_id, loan_amount, loanDetails.totalAmount,
      interest_rate_yearly, loan_period_years, loanDetails.monthlyEmi
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create loan' });
      }

      res.status(201).json({
        loan_id,
        customer_id,
        total_amount_payable: loanDetails.totalAmount,
        monthly_emi: loanDetails.monthlyEmi
      });
    });
  });
});

// 2. PAYMENT: Record a payment for a loan
app.post('/api/v1/loans/:loan_id/payments', (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;

  // Validation
  if (!amount || !payment_type) {
    return res.status(400).json({
      error: 'Missing required fields: amount, payment_type'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      error: 'Payment amount must be positive'
    });
  }

  if (!['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({
      error: 'Payment type must be EMI or LUMP_SUM'
    });
  }

  // Check if loan exists and is active
  db.get('SELECT * FROM loans WHERE loan_id = ? AND status = "ACTIVE"', [loan_id], (err, loan) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!loan) {
      return res.status(404).json({ error: 'Active loan not found' });
    }

    // Calculate total payments made so far
    db.get('SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = ?', 
           [loan_id], (err, paymentSum) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const totalPaid = paymentSum.total_paid;
      const newTotalPaid = totalPaid + amount;
      const remainingBalance = loan.total_amount - newTotalPaid;

      // Check if payment exceeds remaining balance
      if (newTotalPaid > loan.total_amount) {
        return res.status(400).json({
          error: 'Payment amount exceeds remaining loan balance',
          remaining_balance: loan.total_amount - totalPaid
        });
      }

      // Calculate remaining EMIs
      let emisLeft = 0;
      if (remainingBalance > 0) {
        emisLeft = Math.ceil(remainingBalance / loan.monthly_emi);
      }

      // Record payment
      const payment_id = uuidv4();
      const insertPayment = `
        INSERT INTO payments (payment_id, loan_id, amount, payment_type)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insertPayment, [payment_id, loan_id, amount, payment_type], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to record payment' });
        }

        // Update loan status if fully paid
        if (remainingBalance <= 0) {
          db.run('UPDATE loans SET status = "PAID_OFF" WHERE loan_id = ?', [loan_id]);
        }

        res.status(200).json({
          payment_id,
          loan_id,
          message: 'Payment recorded successfully',
          remaining_balance: Math.max(0, remainingBalance),
          emis_left: emisLeft
        });
      });
    });
  });
});

// 3. LEDGER: View loan details and transaction history
app.get('/api/v1/loans/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;

  // Get loan details
  db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, loan) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get all payments for this loan
    db.all(`SELECT payment_id as transaction_id, payment_date as date, 
                   amount, payment_type as type 
            FROM payments WHERE loan_id = ? 
            ORDER BY payment_date ASC`, [loan_id], (err, payments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Calculate total amount paid
      const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const balanceAmount = loan.total_amount - totalPaid;
      const emisLeft = balanceAmount > 0 ? Math.ceil(balanceAmount / loan.monthly_emi) : 0;

      res.status(200).json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        monthly_emi: loan.monthly_emi,
        amount_paid: totalPaid,
        balance_amount: Math.max(0, balanceAmount),
        emis_left: emisLeft,
        transactions: payments
      });
    });
  });
});

// 4. ACCOUNT OVERVIEW: View all loans for a customer
app.get('/api/v1/customers/:customer_id/overview', (req, res) => {
  const { customer_id } = req.params;

  // Check if customer exists
  db.get('SELECT * FROM customers WHERE customer_id = ?', [customer_id], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get all loans for this customer
    db.all('SELECT * FROM loans WHERE customer_id = ?', [customer_id], (err, loans) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (loans.length === 0) {
        return res.status(404).json({ error: 'No loans found for this customer' });
      }

      // For each loan, calculate the amount paid and EMIs left
      const loanPromises = loans.map(loan => {
        return new Promise((resolve, reject) => {
          db.get('SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = ?',
                 [loan.loan_id], (err, paymentSum) => {
            if (err) {
              reject(err);
            } else {
              const totalPaid = paymentSum.total_paid;
              const balanceAmount = loan.total_amount - totalPaid;
              const emisLeft = balanceAmount > 0 ? Math.ceil(balanceAmount / loan.monthly_emi) : 0;
              const totalInterest = loan.total_amount - loan.principal_amount;

              resolve({
                loan_id: loan.loan_id,
                principal: loan.principal_amount,
                total_amount: loan.total_amount,
                total_interest: totalInterest,
                emi_amount: loan.monthly_emi,
                amount_paid: totalPaid,
                emis_left: emisLeft
              });
            }
          });
        });
      });

      Promise.all(loanPromises)
        .then(loanDetails => {
          res.status(200).json({
            customer_id,
            total_loans: loans.length,
            loans: loanDetails
          });
        })
        .catch(err => {
          res.status(500).json({ error: 'Database error processing loans' });
        });
    });
  });
});

// ============== ADDITIONAL ASSIGNMENT PROBLEMS ==============

// Caesar Cipher: Encode/Decode endpoint
app.post('/api/v1/caesar-cipher', (req, res) => {
  const { message, shift, operation } = req.body;

  if (!message || shift === undefined || !operation) {
    return res.status(400).json({
      error: 'Missing required fields: message, shift, operation (encode/decode)'
    });
  }

  if (operation !== 'encode' && operation !== 'decode') {
    return res.status(400).json({
      error: 'Operation must be either "encode" or "decode"'
    });
  }

  let result;
  if (operation === 'encode') {
    result = caesarEncode(message, parseInt(shift));
  } else {
    result = caesarDecode(message, parseInt(shift));
  }

  res.status(200).json({
    original_message: message,
    shift,
    operation,
    result
  });
});

// Indian Currency Format converter
app.post('/api/v1/currency-format', (req, res) => {
  const { number } = req.body;

  if (number === undefined || number === null) {
    return res.status(400).json({
      error: 'Missing required field: number'
    });
  }

  if (isNaN(number)) {
    return res.status(400).json({
      error: 'Invalid number format'
    });
  }

  const formattedNumber = formatIndianCurrency(parseFloat(number));

  res.status(200).json({
    original_number: number,
    formatted_number: formattedNumber
  });
});

// List Combiner
app.post('/api/v1/combine-lists', (req, res) => {
  const { list1, list2 } = req.body;

  if (!Array.isArray(list1) || !Array.isArray(list2)) {
    return res.status(400).json({
      error: 'Both list1 and list2 must be arrays'
    });
  }

  // Validate list format
  const validateList = (list) => {
    return list.every(item => 
      item.positions && 
      Array.isArray(item.positions) && 
      item.positions.length === 2 &&
      typeof item.positions[0] === 'number' &&
      typeof item.positions[1] === 'number' &&
      item.values &&
      Array.isArray(item.values)
    );
  };

  if (!validateList(list1) || !validateList(list2)) {
    return res.status(400).json({
      error: 'Invalid list format. Each item must have "positions" array with 2 numbers and "values" array'
    });
  }

  const combinedList = combineLists(list1, list2);

  res.status(200).json({
    list1,
    list2,
    combined_list: combinedList
  });
});

// Minimizing Loss calculator
app.post('/api/v1/minimize-loss', (req, res) => {
  const { prices } = req.body;

  if (!Array.isArray(prices)) {
    return res.status(400).json({
      error: 'Prices must be an array of numbers'
    });
  }

  if (prices.length < 2) {
    return res.status(400).json({
      error: 'At least 2 prices are required'
    });
  }

  if (!prices.every(price => typeof price === 'number')) {
    return res.status(400).json({
      error: 'All prices must be numbers'
    });
  }

  const result = findMinimumLoss(prices);

  if (result.loss === 0) {
    return res.status(200).json({
      prices,
      message: 'No profitable loss scenario found',
      result: null
    });
  }

  res.status(200).json({
    prices,
    buy_year: result.buyYear,
    sell_year: result.sellYear,
    minimum_loss: result.loss,
    message: `Buy in year ${result.buyYear} at price ${prices[result.buyYear - 1]} and sell in year ${result.sellYear} at price ${prices[result.sellYear - 1]}`
  });
});

// ============== END ADDITIONAL ASSIGNMENT PROBLEMS ==============

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Bank Lending API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Bank Lending API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
