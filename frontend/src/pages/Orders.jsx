/**
 * Orders.jsx - Order History Page
 * 
 * Displays user's order history with:
 * - Order cards with status and shipping info
 * - Expandable order items list
 * - Order status badges (PENDING, PAID, DELIVERED)
 * - Empty state for users with no orders
 */

import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaBox } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]); // Default to empty array
    const [loading, setLoading] = useState(true);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            const data = response.data;

            // Handle Spring Data Page object (has .content) or plain List
            let ordersList = [];
            if (data.content && Array.isArray(data.content)) {
                ordersList = data.content;
            } else if (Array.isArray(data)) {
                ordersList = data;
            }

            setOrders(ordersList);
        } catch (error) {
            toast.error("Failed to load orders");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTrackingStep = (status) => {
        switch (status) {
            case 'PROCESSING': return 2;
            case 'SHIPPED': return 3;
            case 'DELIVERED': return 4;
            default: return 1;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="bg-indigo-50 dark:bg-gray-900 pb-8">
            {/* Header / Hero */}
            <div className="pt-6 pb-4">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Track your past purchases and view invoices.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-4">
                {orders.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-indigo-100 dark:border-gray-700 max-w-md w-full text-center">
                            <div className="mb-4 sm:mb-6 bg-indigo-50 dark:bg-indigo-900/50 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                                <FaBox className="text-2xl sm:text-4xl" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">No Orders Yet</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-lg">
                                Looks like you haven't bought anything yet.
                                <br />Explore our huge collection of books and find your next read!
                            </p>
                            <Link to="/books" className="block w-full bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-700 transition font-bold text-base sm:text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
                                {/* Ticket Header */}
                                <div className="bg-gray-50/50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:flex sm:gap-12 sm:flex-wrap">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Order Placed</p>
                                            <p className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total</p>
                                            <p className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Order #</p>
                                            <p className="text-gray-900 dark:text-white font-mono text-sm mt-0.5">{order.id}</p>
                                        </div>
                                        {order.shippingAddress && (
                                            <div className="w-full mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ship To</p>
                                                <p className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">
                                                    {order.shippingAddress.line1}{order.shippingAddress.line1 && ', '}{order.shippingAddress.city}{order.shippingAddress.postcode && ', '}{order.shippingAddress.postcode}{order.shippingAddress.country && ', '}{order.shippingAddress.country}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow sm:text-right">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
                                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Ticket Body */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.orderItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                                                        {item.bookCover ? (
                                                            <img src={item.bookCover} alt={item.bookTitle} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Book</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.bookTitle}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-gray-900 dark:text-white text-right">
                                                    ${item.subtotal.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ticket Footer (Actions) */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Arriving
                                    </div>
                                    <div className="flex space-x-4">
                                        <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                            View Invoice
                                        </button>
                                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-500 self-center"></div>
                                        <button
                                            onClick={() => setTrackingOrderId(order.id)}
                                            className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 hover:text-primary transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                                        >
                                            Track Package
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tracking Modal (Existing Code) */}
            {/* Keeping it simple here to avoid huge diff, assume trackingOrderId is same logic */}
            {trackingOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in transform transition-all scale-100">
                        <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold">Tracking Details</h3>
                            <button onClick={() => setTrackingOrderId(null)} className="hover:bg-white/20 rounded-full p-1 transition">✕</button>
                        </div>
                        <div className="p-8">
                            {orders.find(o => o.id === trackingOrderId) && (
                                <>
                                    <div className="mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Arriving Soon</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Expected Delivery: {new Date(new Date().setDate(new Date().getDate() + 5)).toDateString()}</p>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                                        {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => {
                                            const currentOrder = orders.find(o => o.id === trackingOrderId);
                                            const currentStep = getTrackingStep(currentOrder.status);
                                            const isCompleted = index < currentStep;
                                            const isCurrent = index === currentStep - 1;

                                            return (
                                                <div key={step} className="relative pl-12 pb-8 last:pb-0">
                                                    <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500
                                                        ${isCompleted ? 'bg-green-500 border-white text-white scale-100' :
                                                            isCurrent ? 'bg-primary border-blue-100 text-white animate-pulse scale-110' :
                                                                'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-500 text-gray-300 dark:text-gray-500 scale-90'}`}
                                                    >
                                                        {isCompleted ? '✓' : index + 1}
                                                    </div>
                                                    <h5 className={`font-bold text-lg transition-colors ${isCompleted || isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step}</h5>
                                                    {(isCompleted || isCurrent) && <p className="text-xs text-gray-400">Completed</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
