/**
 * Cart.jsx - Shopping Cart Page
 * 
 * Manages the shopping cart experience:
 * - Displays cart items with quantity controls
 * - Calculates order totals
 * - Checkout flow with address input
 * - Payment integration
 * - Empty cart and login prompts for guests
 */

import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaCreditCard } from 'react-icons/fa';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { refreshCart, decrementCartCount } = useCart();
    const navigate = useNavigate();
    const [checkoutMode, setCheckoutMode] = useState(false);
    const [address, setAddress] = useState({ line1: '', city: '', postcode: '', country: '' });

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1 || !cart || !cart.items) return;

        // Save previous state for rollback if needed (deep clone)
        const previousCart = JSON.parse(JSON.stringify(cart));

        // Calculate new total using unitPrice (not book.price)
        const updatedItems = cart.items.map(item =>
            item.id === itemId
                ? { ...item, quantity, subtotal: item.unitPrice * quantity }
                : item
        );
        const newTotal = updatedItems.reduce((total, item) => total + item.subtotal, 0);

        // Optimistic update - update UI immediately
        setCart({
            ...cart,
            items: updatedItems,
            totalAmount: newTotal
        });

        try {
            // Sync with backend
            await api.put(`/cart/items/${itemId}`, { quantity });
            refreshCart();
        } catch (error) {
            // Rollback on error
            setCart(previousCart);
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (itemId) => {
        if (!cart || !cart.items) return;

        // Save previous state for rollback if needed (deep clone)
        const previousCart = JSON.parse(JSON.stringify(cart));

        // Find item to remove and calculate new values
        const itemToRemove = cart.items.find(item => item.id === itemId);
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const newTotal = cart.totalAmount - (itemToRemove?.subtotal || 0);

        // Optimistic update - remove item from UI immediately
        setCart({
            ...cart,
            items: updatedItems,
            totalAmount: newTotal
        });
        decrementCartCount(); // Update badge immediately

        try {
            await api.delete(`/cart/items/${itemId}`);
            toast.success("Item removed");
        } catch (error) {
            // Rollback on error
            setCart(previousCart);
            refreshCart();
            toast.error("Failed to remove item");
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/orders', {
                shippingAddress: address,
                paymentProvider: 'simulated'
            });
            toast.success("Order placed successfully!");
            setCart(null);
            setCheckoutMode(false);
            refreshCart();
            navigate('/order-success', { state: { orderId: response.data.id } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Checkout failed");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-indigo-100 dark:border-gray-700 max-w-md w-full">
                    <div className="mb-4 sm:mb-6 bg-indigo-50 dark:bg-indigo-900/50 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                        <FaCreditCard className="text-2xl sm:text-4xl" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">Your Cart</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-lg">
                        Please login to view your cart and start shopping!
                    </p>
                    <Link
                        to="/login"
                        className="block w-full bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-700 transition font-bold text-base sm:text-lg shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Login to Continue
                    </Link>
                    <Link
                        to="/register"
                        className="block w-full mt-3 border-2 border-primary text-primary dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 dark:hover:text-white transition font-bold text-base sm:text-lg"
                    >
                        Create Account
                    </Link>
                </div>
                <div className="mt-6 sm:mt-8 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                    Want to browse first? <Link to="/books" className="text-primary hover:underline">View Books</Link>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-indigo-100 dark:border-gray-700 max-w-md w-full">
                    <div className="mb-4 sm:mb-6 bg-indigo-50 dark:bg-indigo-900/50 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                        <FaCreditCard className="text-2xl sm:text-4xl" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">Your Cart is Empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-lg">
                        Looks like you haven't added any books yet.
                        <br />There are so many amazing stories waiting for you!
                    </p>
                    <Link
                        to="/books"
                        className="block w-full bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-700 transition font-bold text-base sm:text-lg shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Start Browsing
                    </Link>
                </div>
                <div className="mt-6 sm:mt-8 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                    Need help? <a href="https://github.com/iammanoj807" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Contact Support</a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${!checkoutMode ? 'bg-primary text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'bg-green-500 text-white'}`}>
                            {!checkoutMode ? '1' : '✓'}
                        </div>
                        <span className="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">Cart</span>
                    </div>
                    <div className={`w-24 h-1 rounded ${checkoutMode ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${checkoutMode ? 'bg-primary text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            2
                        </div>
                        <span className="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">Checkout</span>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">{checkoutMode ? 'Checkout Details' : 'Shopping Cart'}</h1>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {!checkoutMode ? (
                        /* Cart Items List */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {cart.items.map((item, idx) => (
                                <div key={item.id} className={`p-3 sm:p-6 flex gap-3 sm:gap-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${idx !== cart.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                                    {item.coverImageUrl ? (
                                        <img src={item.coverImageUrl} alt={item.bookTitle} className="w-20 h-28 sm:w-24 sm:h-36 object-cover rounded-lg shadow-md" />
                                    ) : (
                                        <div className="w-20 h-28 sm:w-24 sm:h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                                            <span className="text-xs">No Img</span>
                                        </div>
                                    )}
                                    <div className="flex-grow flex flex-col justify-between py-1 min-w-0">
                                        <div>
                                            <h3 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-white mb-1 truncate sm:whitespace-normal">{item.bookTitle}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">${item.unitPrice.toFixed(2)}</p>
                                        </div>

                                        <div className="flex flex-wrap items-end sm:items-center justify-between mt-2 sm:mt-4 gap-y-4">
                                            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 sm:px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary transition"
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <span className="px-2 sm:px-3 py-1 font-semibold text-gray-700 dark:text-white min-w-[2rem] sm:min-w-[2.5rem] text-center border-x border-gray-200 dark:border-gray-600 text-sm sm:text-base">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 sm:px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary transition"
                                                >+</button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1">${item.subtotal.toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 text-xs sm:text-sm hover:text-red-700 font-medium flex items-center justify-end gap-1 transition ml-auto"
                                                ><FaTrash size={12} /> Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Checkout Form */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                                <span className="bg-blue-100 dark:bg-indigo-900 text-primary p-2 rounded-lg mr-3">
                                    <FaCreditCard size={20} />
                                </span>
                                Shipping & Payment
                            </h3>
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Line 1</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 dark:placeholder-gray-400"
                                        placeholder="123 Main St"
                                        value={address.line1}
                                        onChange={e => setAddress({ ...address, line1: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 dark:placeholder-gray-400"
                                            placeholder="New York"
                                            value={address.city}
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postcode</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 dark:placeholder-gray-400"
                                            placeholder="10001"
                                            value={address.postcode}
                                            onChange={e => setAddress({ ...address, postcode: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 dark:placeholder-gray-400"
                                        placeholder="USA"
                                        value={address.country}
                                        onChange={e => setAddress({ ...address, country: e.target.value })}
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                    <div className="bg-white dark:bg-blue-800 p-1 rounded-full text-blue-500 dark:text-blue-300 mt-0.5">
                                        <FaCreditCard size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Payment Simulation</p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">No actual payment will be processed. This is a demonstration environment.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sticky Summary Side */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${cart.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Taxes</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-extrabold text-3xl text-primary">${cart.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {!checkoutMode ? (
                            <button
                                onClick={() => setCheckoutMode(true)}
                                className="w-full bg-primary text-white py-4 rounded-xl hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-lg shadow-indigo-200 dark:shadow-none font-bold text-lg"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition transform hover:-translate-y-1 shadow-lg shadow-green-200 dark:shadow-none font-bold text-lg"
                                >
                                    Confirm Order
                                </button>
                                <button
                                    onClick={() => setCheckoutMode(false)}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        )}

                        <div className="mt-8 flex justify-center gap-4 text-gray-400">
                            {/* Trust Badges */}
                            <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
