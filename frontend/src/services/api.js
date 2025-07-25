import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const loanService = {
  // Create a new loan
  createLoan: (loanData) => {
    return api.post('/loans', loanData);
  },

  // Record a payment for a loan
  recordPayment: (loanId, paymentData) => {
    return api.post(`/loans/${loanId}/payments`, paymentData);
  },

  // Get loan ledger
  getLoanLedger: (loanId) => {
    return api.get(`/loans/${loanId}/ledger`);
  },

  // Get customer overview
  getCustomerOverview: (customerId) => {
    return api.get(`/customers/${customerId}/overview`);
  },

  // Health check
  healthCheck: () => {
    return api.get('/health');
  }
};

export default api;
