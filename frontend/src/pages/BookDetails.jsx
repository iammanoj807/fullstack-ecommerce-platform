/**
 * BookDetails.jsx - Individual Book Detail Page
 * 
 * Displays detailed book information including:
 * - Book cover image with scaling
 * - Title, author, price, and ratings
 * - Description (truncated to 100 words)
 * - Add to cart functionality (authenticated users only)
 * - Customer reviews section
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Reviews from '../components/Reviews';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const { refreshCart, incrementCartCount, decrementCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (error) {
                toast.error("Failed to load book details");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, navigate]);

    const addToCart = async () => {
        if (!user) {
            toast.info("Please login to add to cart");
            navigate('/login');
            return;
        }

        // Optimistic update - increment cart count immediately
        incrementCartCount();
        toast.success("Added to cart");

        try {
            await api.post('/cart/items', { bookId: book.id, quantity });
            // Sync with actual count from backend
            refreshCart();
        } catch (error) {
            // Rollback on error
            decrementCartCount();
            toast.error("Failed to add to cart");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
    if (!book) return null;

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary mb-6 transition">
                <FaArrowLeft className="mr-2" /> Back
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image */}
                    <div className="flex items-start justify-center">
                        {book.coverImageUrl ? (
                            <img src={book.coverImageUrl} alt={book.title} className="max-w-full rounded-lg shadow-lg md:scale-125 origin-top" style={{ maxHeight: '450px' }} />
                        ) : (
                            <div className="flex items-center justify-center h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-lg">No Cover Image</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>

                        <div className="flex items-center mb-6">
                            <FaStar className="text-yellow-400 text-xl mr-2" />
                            <span className="text-lg font-medium dark:text-white">
                                {book.ratingAverage ? book.ratingAverage.toFixed(1) : 'New'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">({book.ratingCount || 0} reviews)</span>
                        </div>

                        <div className="text-2xl font-bold text-primary mb-6">${book.price.toFixed(2)}</div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 flex-grow text-justify">
                            {book.description
                                ? (book.description.split(' ').length > 100
                                    ? book.description.split(' ').slice(0, 100).join(' ') + '...'
                                    : book.description)
                                : "No description available."}
                        </p>

                        {/* Actions - Only show when logged in */}
                        {user && (
                            <div className="flex items-center space-x-4 border-t dark:border-gray-700 pt-6">
                                <div className="flex items-center border dark:border-gray-600 rounded-md">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                    >-</button>
                                    <span className="px-4 py-2 font-medium dark:text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                    >+</button>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className="flex-1 bg-primary text-white py-3 px-6 rounded-md hover:bg-blue-600 transition flex items-center justify-center font-semibold"
                                >
                                    <FaShoppingCart className="mr-2" /> Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <Reviews bookId={id} />
        </div>
    );
};

export default BookDetails;
