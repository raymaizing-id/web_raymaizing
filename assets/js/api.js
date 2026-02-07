// API Configuration
const API_URL = 'http://localhost/raymaizing-api/public/api'; // Update with your actual API URL

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Helper function to get headers
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API response
async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

// Auth API
const authAPI = {
  async register(data) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  async login(data) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await handleResponse(response);
    
    // Store token and user data
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  },
  
  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    return handleResponse(response);
  },
  
  async getUser() {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Subscription API
const subscriptionAPI = {
  async list() {
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  async create(data) {
    const response = await fetch(`${API_URL}/subscriptions/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  async get(id) {
    const response = await fetch(`${API_URL}/subscriptions/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  async cancel(id) {
    const response = await fetch(`${API_URL}/subscriptions/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Payment API
const paymentAPI = {
  async createTransaction(data) {
    const response = await fetch(`${API_URL}/payment/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  async verifyPayment(orderId) {
    const response = await fetch(`${API_URL}/payment/verify/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  async getTransactionStatus(orderId) {
    const response = await fetch(`${API_URL}/payment/status/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Usage API
const usageAPI = {
  async current() {
    const response = await fetch(`${API_URL}/usage/current`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  
  async track(data) {
    const response = await fetch(`${API_URL}/usage/track`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  async history() {
    const response = await fetch(`${API_URL}/usage/history`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Export APIs
window.authAPI = authAPI;
window.subscriptionAPI = subscriptionAPI;
window.paymentAPI = paymentAPI;
window.usageAPI = usageAPI;
