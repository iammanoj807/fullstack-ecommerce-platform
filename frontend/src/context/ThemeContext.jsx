/**
 * ThemeContext.jsx - Dark Mode Theme Provider
 * 
 * Manages dark/light theme state across the application:
 * - Persists preference in localStorage
 * - Applies 'dark' class to document root
 * - Provides toggle function for theme switching
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the application to provide theme state globally
 */
export const ThemeProvider = ({ children }) => {
    // Initialize from localStorage or default to light mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    // Apply dark class to document when theme changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    /**
     * Toggle between dark and light mode
     */
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to access theme context
 * @returns {Object} - Theme context value (isDarkMode, toggleDarkMode)
 */
export const useTheme = () => useContext(ThemeContext);
