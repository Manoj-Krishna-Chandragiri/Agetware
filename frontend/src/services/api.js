import axios from 'axios';

// Handle both local development and production deployment URLs
const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  
  if (envUrl) {
    // If environment URL is set, ensure it includes /api/v1
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

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
    console.log('Full URL:', `${API_BASE_URL}${config.url}`);
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
  },

  // Assignment Problem APIs
  caesarCipher: (data) => {
    return api.post('/caesar-cipher', data);
  },

  currencyFormat: (data) => {
    return api.post('/currency-format', data);
  },

  combineLists: (data) => {
    return api.post('/combine-lists', data);
  },

  minimizeLoss: (data) => {
    return api.post('/minimize-loss', data);
  }
};

// Export the API base URL for direct fetch calls if needed
export const API_BASE_URL_EXPORT = API_BASE_URL;

export default api;
