/**
 * CartContext.jsx - Shopping Cart Context Provider
 * 
 * Manages cart state across the application:
 * - Tracks number of unique items in cart
 * - Provides refresh function for cart updates
 * - Syncs with backend cart data
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

// Create cart context
const CartContext = createContext();

/**
 * CartProvider Component
 * Wraps the application to provide cart state globally
 */
export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    /**
     * Fetch cart item count from the backend
     * Only fetches if user is authenticated
     */
    const fetchCartCount = useCallback(async () => {
        if (!user) {
            setCartCount(0);
            return;
        }
        try {
            const response = await api.get('/cart');
            const items = response.data?.items || [];
            // Count unique products in cart (not total quantity)
            setCartCount(items.length);
        } catch (error) {
            setCartCount(0);
        }
    }, [user]);

    // Fetch cart count when user changes
    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    /**
     * Manually refresh cart count
     * Call this after adding/removing items from cart
     */
    const refreshCart = () => {
        fetchCartCount();
    };

    /**
     * Optimistically increment cart count (for instant UI feedback)
     */
    const incrementCartCount = () => {
        setCartCount(prev => prev + 1);
    };

    /**
     * Optimistically decrement cart count (for instant UI feedback)
     */
    const decrementCartCount = () => {
        setCartCount(prev => Math.max(0, prev - 1));
    };

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, incrementCartCount, decrementCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Custom hook to access cart context
 * @returns {Object} - Cart context value (cartCount, refreshCart)
 */
export const useCart = () => useContext(CartContext);

