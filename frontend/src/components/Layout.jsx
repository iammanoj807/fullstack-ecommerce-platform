/**
 * Layout.jsx - Application Layout Wrapper
 * 
 * Provides consistent page structure with:
 * - Navigation bar at top
 * - Main content area (renders child routes)
 * - Footer at bottom
 * - Toast notification container
 */

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout Component
 * Wraps all pages with consistent navigation and footer
 */
const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-indigo-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Site Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Site Footer */}
            <Footer />

            {/* Toast Notifications */}
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default Layout;
