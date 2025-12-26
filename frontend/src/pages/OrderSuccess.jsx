/**
 * OrderSuccess.jsx - Order Confirmation Page
 * 
 * Displayed after successful checkout:
 * - Order confirmation animation
 * - Order ID display
 * - Links to track order and continue shopping
 */

import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    // In case we pass state via navigation, though standard access via Orders is fine too
    const { orderId } = location.state || {};

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-3xl shadow-xl border border-blue-50 dark:border-gray-700 p-10 text-center relative overflow-hidden"
            >
                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-100 dark:shadow-none"
                    >
                        <FaCheckCircle size={48} />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Order Placed!</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                    Thank you for your purchase. We've received your order and are getting it ready!
                </p>

                {orderId && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-600 inline-block">
                        <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Order ID</span>
                        <div className="text-xl font-mono font-bold text-gray-900 dark:text-white">#{orderId}</div>
                    </div>
                )}

                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-blue-200 dark:shadow-none group"
                    >
                        <FaBoxOpen />
                        <span>Track My Order</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                    </Link>

                    <Link
                        to="/books"
                        className="w-full block text-gray-600 dark:text-gray-400 font-medium hover:text-primary transition py-2"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;

