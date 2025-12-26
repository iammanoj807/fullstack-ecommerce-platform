/**
 * NotFound.jsx - 404 Error Page
 * 
 * Displayed when user navigates to an invalid URL:
 * - Clear error message
 * - Navigation link back to home
 * - Consistent styling with rest of app
 */

import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center bg-indigo-50 dark:bg-gray-900 pt-24 sm:pt-32 py-12 px-4">
            <div className="text-center">
                <div className="mx-auto h-24 w-24 text-primary flex justify-center items-center rounded-full bg-blue-100 dark:bg-indigo-900 mb-6">
                    <FaExclamationTriangle size={48} />
                </div>
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium"
                >
                    <FaHome className="mr-2" /> Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
