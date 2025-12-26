/**
 * Navbar.jsx - Navigation Bar Component
 * 
 * Responsive navigation bar with:
 * - Brand logo and site name
 * - Desktop and mobile navigation menus
 * - Active link highlighting
 * - Cart badge showing item count
 * - Dark mode toggle
 * - Conditional rendering based on auth state
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBook, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';

/**
 * Navbar Component
 * Displays navigation links and user actions
 */
const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    /**
     * Check if current path matches the given path
     * Used for active link highlighting
     */
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <FaBook className="text-primary text-xl" />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Novela
                    </span>
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden text-gray-600 dark:text-gray-300 hover:text-primary p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex items-center space-x-8">
                        {/* Main Navigation Links */}
                        <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>Home</Link>

                        {/* Cart Icon - Visible only when logged in */}
                        {user && (
                            <Link to="/cart" className={`relative group transition ${isActive('/cart') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                                <FaShoppingCart size={20} />
                                {/* Cart Badge - Shows number of items */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Cart
                                </span>
                            </Link>
                        )}

                        {/* User Menu - Conditional based on auth state */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* Admin Link - Visible only to admins */}
                                {user.roles && user.roles.includes('ROLE_ADMIN') && (
                                    <Link to="/admin" className={`font-medium ${isActive('/admin') ? 'text-red-600' : 'text-red-500 hover:text-red-600'}`}>Admin</Link>
                                )}
                                <Link to="/orders" className={`font-medium transition-colors ${isActive('/orders') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>Orders</Link>
                                <Link to="/profile" className={`relative group transition ${isActive('/profile') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                                    <FaUser size={20} />
                                    {/* Tooltip */}
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Profile
                                    </span>
                                </Link>
                                <button onClick={logout} className="relative group text-gray-600 dark:text-gray-300 hover:text-red-500 transition" aria-label="Logout">
                                    <FaSignOutAlt size={20} />
                                    {/* Tooltip */}
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Logout
                                    </span>
                                </button>
                                {/* Dark Mode Toggle - Inside user menu */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="relative group p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} />}
                                    {/* Tooltip */}
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/register" className="font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-primary">
                                    Register
                                </Link>
                                {/* Dark Mode Toggle - For logged out users */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="relative group p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} />}
                                    {/* Tooltip */}
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4 px-4 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>

                            {/* Authenticated User Links */}
                            {user && (
                                <>
                                    <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
                                    <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                                    <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                    {user.roles && user.roles.includes('ROLE_ADMIN') && (
                                        <Link to="/admin" className="text-red-500 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                                    )}
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-red-500 font-medium py-2">
                                        Logout
                                    </button>
                                </>
                            )}

                            {/* Guest User Link */}
                            {!user && (
                                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                                    Register
                                </Link>
                            )}

                            {/* Dark Mode Toggle - At bottom with separator */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                                <button
                                    onClick={toggleDarkMode}
                                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm"
                                >
                                    {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon />}
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
