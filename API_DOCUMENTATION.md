# Bank Lending System API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Endpoints

### 1. Health Check
**GET** `/health`

**Description:** Check if the API is running

**Response:**
```json
{
  "status": "OK",
  "message": "Bank Lending API is running"
}
```

---

### 2. Create Loan (LEND)
**POST** `/loans`

**Description:** Create a new loan for a customer

**Request Body:**
```json
{
  "customer_id": "CUST001",
  "loan_amount": 100000,
  "loan_period_years": 5,
  "interest_rate_yearly": 10
}
```

**Success Response (201):**
```json
{
  "loan_id": "uuid-string",
  "customer_id": "CUST001",
  "total_amount_payable": 150000,
  "monthly_emi": 2500
}
```

**Error Responses:**
- `400` - Invalid input data
- `500` - Server error

---

### 3. Record Payment (PAYMENT)
**POST** `/loans/{loan_id}/payments`

**Description:** Record a payment against a loan

**Request Body:**
```json
{
  "amount": 2500,
  "payment_type": "EMI"
}
```

**Payment Types:**
- `EMI` - Regular monthly payment
- `LUMP_SUM` - Additional payment

**Success Response (200):**
```json
{
  "payment_id": "uuid-string",
  "loan_id": "uuid-string",
  "message": "Payment recorded successfully",
  "remaining_balance": 147500,
  "emis_left": 59
}
```

**Error Responses:**
- `400` - Invalid payment data or amount exceeds balance
- `404` - Loan not found
- `500` - Server error

---

### 4. View Ledger (LEDGER)
**GET** `/loans/{loan_id}/ledger`

**Description:** Get complete loan details and transaction history

**Success Response (200):**
```json
{
  "loan_id": "uuid-string",
  "customer_id": "CUST001",
  "principal": 100000,
  "total_amount": 150000,
  "monthly_emi": 2500,
  "amount_paid": 2500,
  "balance_amount": 147500,
  "emis_left": 59,
  "transactions": [
    {
      "transaction_id": "uuid-string",
      "date": "2025-01-01T10:00:00.000Z",
      "amount": 2500,
      "type": "EMI"
    }
  ]
}
```

**Error Responses:**
- `404` - Loan not found
- `500` - Server error

---

### 5. Customer Overview (ACCOUNT OVERVIEW)
**GET** `/customers/{customer_id}/overview`

**Description:** Get summary of all loans for a customer

**Success Response (200):**
```json
{
  "customer_id": "CUST001",
  "total_loans": 2,
  "loans": [
    {
      "loan_id": "uuid-string",
      "principal": 100000,
      "total_amount": 150000,
      "total_interest": 50000,
      "emi_amount": 2500,
      "amount_paid": 2500,
      "emis_left": 59
    }
  ]
}
```

**Error Responses:**
- `404` - Customer not found or no loans
- `500` - Server error

---

## Calculation Formulas

### Simple Interest
```
Total Interest (I) = P × N × (R / 100)
Where:
- P = Principal amount
- N = Number of years
- R = Interest rate per year
```

### Monthly EMI
```
Monthly EMI = (Principal + Total Interest) / (Years × 12)
```

### Remaining EMIs
```
EMIs Left = Ceiling(Remaining Balance / Monthly EMI)
```

---

## Error Handling

All errors return JSON in the format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Sample cURL Commands

### Create a loan
```bash
curl -X POST http://localhost:3001/api/v1/loans \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "loan_amount": 100000,
    "loan_period_years": 5,
    "interest_rate_yearly": 10
  }'
```

### Record a payment
```bash
curl -X POST http://localhost:3001/api/v1/loans/{loan_id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "payment_type": "EMI"
  }'
```

### Get loan ledger
```bash
curl http://localhost:3001/api/v1/loans/{loan_id}/ledger
```

### Get customer overview
```bash
curl http://localhost:3001/api/v1/customers/CUST001/overview
```
