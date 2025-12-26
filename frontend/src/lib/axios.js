/**
 * axios.js - API Client Configuration
 * 
 * Configures Axios instance for API communication:
 * - Base URL for backend API
 * - Request interceptor to attach JWT token to all requests
 * - Response interceptor for global error handling
 */

import axios from 'axios';

// API base URL - uses environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Create Axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token from localStorage to all outgoing requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles global error responses (e.g., 401 Unauthorized)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access if needed
        }
        return Promise.reject(error);
    }
);

export default api;
