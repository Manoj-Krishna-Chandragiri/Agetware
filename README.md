# Bank Lending System

A simple loan management system built with Node.js backend and React frontend.

## Features

- Create loans with simple interest calculation
- Record EMI and lump sum payments  
- View complete transaction history
- Customer portfolio overview

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

- `POST /api/v1/loans` - Create loan
- `POST /api/v1/loans/{id}/payments` - Record payment
- `GET /api/v1/loans/{id}/ledger` - View ledger
- `GET /api/v1/customers/{id}/overview` - Customer overview
