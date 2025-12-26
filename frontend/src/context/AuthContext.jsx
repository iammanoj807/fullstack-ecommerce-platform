/**
 * AuthContext.jsx - Authentication Context Provider
 * 
 * Manages user authentication state across the application:
 * - JWT token storage and validation
 * - Login/Register/Logout functionality
 * - User session persistence via localStorage
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

// Create authentication context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the application to provide authentication state and methods
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Initialize auth state from stored token on mount
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Check if token has expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // Set user info from token payload
                    setUser({ email: decoded.sub, roles: decoded.roles });
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    /**
     * Authenticate user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {boolean} - Success status
     */
    const login = async (email, password, captchaId, captchaAnswer) => {
        try {
            const response = await api.post('/auth/login', { email, password, captchaId, captchaAnswer });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            const message = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.message || "Login failed";
            toast.error(message);
            return false;
        }
    };

    /**
     * Register a new user account
     * @param {Object} userData - User registration data
     * @returns {boolean} - Success status
     */
    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            toast.success("Registration successful! Please login.");
            return true;
        } catch (error) {
            const message = typeof error.response?.data === 'string'
                ? error.response.data
                : error.response?.data?.message || "Registration failed";
            toast.error(message);
            return false;
        }
    }

    /**
     * Log out the current user
     * Clears token from storage and resets state
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.info("Logged out");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access authentication context
 * @returns {Object} - Auth context value (user, token, login, logout, register, loading)
 */
export const useAuth = () => useContext(AuthContext);
