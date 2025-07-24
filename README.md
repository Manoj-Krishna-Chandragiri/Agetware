# Bank Lending System

A simple bank lending system built with Node.js/Express.js backend and React.js frontend.

## Features

- Create new loans (LEND)
- Record payments (PAYMENT) 
- View loan ledger (LEDGER)
- Customer account overview

## Architecture

- **Backend**: Node.js with Express.js REST API
- **Frontend**: React.js single-page application
- **Database**: SQLite for data persistence

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The backend will run on http://localhost:3001 and frontend on http://localhost:3000.

## API Endpoints

- `POST /api/v1/loans` - Create a new loan
- `POST /api/v1/loans/{loan_id}/payments` - Record a payment
- `GET /api/v1/loans/{loan_id}/ledger` - Get loan ledger
- `GET /api/v1/customers/{customer_id}/overview` - Get customer overview

## Interest Calculation

Uses Simple Interest formula: `I = P * N * R / 100`
- EMI = (Principal + Total Interest) / (Years * 12)
