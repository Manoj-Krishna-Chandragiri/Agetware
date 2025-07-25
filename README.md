# Bank Lending System with Assignment Problems

A comprehensive bank lending system that implements both core banking functionality and solutions to 4 programming assignment problems.

## 🏗️ Project Structure

```
Agetware-Assignment/
├── backend/                    # Node.js/Express API server
│   ├── server.js              # Main server file with all APIs
│   ├── package.json           # Backend dependencies
│   ├── bank_lending.db        # SQLite database
│   └── .gitignore            # Backend gitignore
├── frontend/                  # React.js frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Home.js       # Main dashboard
│   │   │   ├── CreateLoan.js # Bank loan creation
│   │   │   ├── RecordPayment.js # Payment recording
│   │   │   ├── ViewLedger.js # Transaction ledger
│   │   │   ├── CustomerOverview.js # Customer overview
│   │   │   ├── CaesarCipher.js # Assignment 1: Caesar Cipher
│   │   │   ├── CurrencyFormatter.js # Assignment 2: Indian Currency
│   │   │   ├── ListCombiner.js # Assignment 3: List Combiner
│   │   │   └── MinimizingLoss.js # Assignment 4: Minimizing Loss
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── App.js            # Main React app
│   │   ├── index.js          # App entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   │   └── index.html        # HTML template
│   └── package.json          # Frontend dependencies
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manoj-Krishna-Chandragiri/Agetware.git
   cd Agetware-Assignment
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on: `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on: `http://localhost:3000` (or next available port)

4. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Backend API health check: `http://localhost:5000/api/v1/health`

## 🏦 Banking System Features

### Core Banking APIs

1. **LEND** - Create new loans
   - `POST /api/v1/loans`
   - Parameters: customer_id, loan_amount, loan_period, interest_rate
   - Returns: Total amount, monthly EMI

2. **PAYMENT** - Record loan payments
   - `POST /api/v1/loans/:loan_id/payments`
   - Supports both EMI and lump sum payments

3. **LEDGER** - View transaction history
   - `GET /api/v1/loans/:loan_id/ledger`
   - Returns all transactions, balance, EMI details

4. **ACCOUNT OVERVIEW** - Customer loan summary
   - `GET /api/v1/customers/:customer_id/overview`
   - Lists all loans with payment status

### Calculations
- **Interest**: I = P × N × R
- **Total Amount**: A = P + I
- **EMI**: A / (N × 12)

## 🎯 Assignment Problems Solutions

### 1. Caesar Cipher (`/api/v1/caesar-cipher`)
Implements encoding and decoding with customizable shift values.

**Example:**
```json
POST /api/v1/caesar-cipher
{
  "message": "Hello World",
  "shift": 3,
  "operation": "encode"
}
Response: "Khoor Zruog"
```

### 2. Indian Currency Formatter (`/api/v1/currency-format`)
Converts numbers to Indian numbering system with proper comma placement.

**Example:**
```json
POST /api/v1/currency-format
{
  "number": 123456.7891
}
Response: "1,23,456.7891"
```

### 3. List Combiner (`/api/v1/combine-lists`)
Combines two lists of positioned elements based on overlap rules.

**Example:**
```json
POST /api/v1/combine-lists
{
  "list1": [{"positions": [1, 5], "values": ["A", "B"]}],
  "list2": [{"positions": [3, 7], "values": ["C", "D"]}]
}
```

### 4. Minimizing Loss (`/api/v1/minimize-loss`)
Finds optimal buy/sell years to minimize loss in house price projections.

**Example:**
```json
POST /api/v1/minimize-loss
{
  "prices": [20, 15, 7, 2, 13]
}
Response: Buy year 2, Sell year 5, Loss: 2
```
- Customer portfolio overview

### Assignment Problems
- **Caesar Cipher**: Encode/decode messages with configurable shift
- **Indian Currency Format**: Convert numbers to Indian numbering system
- **List Combiner**: Merge position-based lists with overlap detection
- **Minimizing Loss**: Find optimal buy/sell strategy for declining prices

## Setup

**Prerequisites:** Node.js (v14+) and npm

1. **Backend Setup:**
```bash
cd backend
npm install
npm start
```

2. **Frontend Setup:**
```bash
cd frontend  
npm install
npm start
```

3. **Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

**Test Customers:**
- CUST001 - Manoj Krishna
- CUST002 - Priya Sharma
- CUST003 - Arjun Patel

**Interest Calculation:**
- Simple Interest: I = P × N × R / 100
- Monthly EMI: (Principal + Interest) / (Years × 12)

## API Endpoints

### Bank Lending System
- `POST /api/v1/loans` - Create loan
- `POST /api/v1/loans/{id}/payments` - Record payment
- `GET /api/v1/loans/{id}/ledger` - View ledger
- `GET /api/v1/customers/{id}/overview` - Customer overview

### Assignment Problems
- `POST /api/v1/caesar-cipher` - Encode/decode messages
- `POST /api/v1/currency-format` - Format numbers to Indian currency
- `POST /api/v1/combine-lists` - Combine position-based lists
- `POST /api/v1/minimize-loss` - Calculate optimal loss strategy

## Assignment Problem Examples

### 1. Caesar Cipher
```bash
POST /api/v1/caesar-cipher
{
  "message": "Hello World",
  "shift": 3,
  "operation": "encode"
}
# Returns: "Khoor Zruog"
```

### 2. Indian Currency Format
```bash
POST /api/v1/currency-format
{
  "number": 123456.7891
}
# Returns: "1,23,456.7891"
```

### 3. List Combiner
```bash
POST /api/v1/combine-lists
{
  "list1": [{"positions": [1, 4], "values": ["A", "B"]}],
  "list2": [{"positions": [2, 5], "values": ["D"]}]
}
# Combines lists based on position overlap
```

### 4. Minimizing Loss
```bash
POST /api/v1/minimize-loss
{
  "prices": [20, 15, 7, 2, 13]
}
# Returns: Buy year 2, Sell year 5, Loss: 2
```
