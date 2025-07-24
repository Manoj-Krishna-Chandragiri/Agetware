# Bank Lending System - Setup Guide

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Clone and Navigate to Project
```powershell
cd "d:\Projects\Agetware-Assignment"
```

### 2. Backend Setup
```powershell
cd backend
npm install
```

### 3. Frontend Setup
```powershell
cd ..\frontend
npm install
```

## Running the Application

### 1. Start the Backend Server
Open a PowerShell terminal and run:
```powershell
cd "d:\Projects\Agetware-Assignment\backend"
npm start
```
The backend API will be available at `http://localhost:3001`

### 2. Start the Frontend Application
Open another PowerShell terminal and run:
```powershell
cd "d:\Projects\Agetware-Assignment\frontend"
npm start
```
The frontend will be available at `http://localhost:3000`

## Testing the Application

### Sample Data
The system comes with pre-loaded customers:
- CUST001 - John Doe
- CUST002 - Jane Smith  
- CUST003 - Bob Johnson

### Test Workflow
1. **Create a Loan**: Go to "Create Loan" and create a loan for any customer
2. **Record Payments**: Use the loan ID to record EMI or lump sum payments
3. **View Ledger**: Check the complete transaction history for a loan
4. **Customer Overview**: See all loans for a specific customer

### API Endpoints
- `POST /api/v1/loans` - Create new loan
- `POST /api/v1/loans/{loan_id}/payments` - Record payment
- `GET /api/v1/loans/{loan_id}/ledger` - View loan ledger
- `GET /api/v1/customers/{customer_id}/overview` - Customer overview
- `GET /api/v1/health` - Health check

## Features

### Loan Calculation
- **Interest Formula**: Simple Interest = P × N × R / 100
- **EMI Calculation**: (Principal + Total Interest) / (Years × 12)
- **Automatic Updates**: Remaining balance and EMIs recalculated after each payment

### Payment Types
- **EMI**: Regular monthly installments
- **Lump Sum**: Additional payments to reduce outstanding balance

### Data Persistence
- SQLite database stores all loan and payment data
- Database file created automatically on first run

## Troubleshooting

### Common Issues
1. **Backend not starting**: Check if port 3001 is available
2. **Frontend not connecting**: Ensure backend is running first
3. **Database errors**: Delete `bank_lending.db` file and restart backend

### Logs
Check the terminal output for detailed error messages and API request logs.

## Development

### Backend Development
```powershell
cd backend
npm run dev  # Using nodemon for auto-restart
```

### Frontend Development
The React development server automatically reloads on file changes.

## Architecture

- **Frontend**: React.js SPA with React Router
- **Backend**: Node.js with Express.js REST API
- **Database**: SQLite for data persistence
- **Styling**: CSS with responsive design
