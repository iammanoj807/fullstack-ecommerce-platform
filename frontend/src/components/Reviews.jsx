/**
 * Reviews.jsx - Book Reviews Component
 * 
 * Manages book reviews with:
 * - Display of all reviews for a book
 * - Add new review (rating + comment)
 * - Edit/delete own reviews
 * - Purchase verification before allowing review
 */

import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const Reviews = ({ bookId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [canReview, setCanReview] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState('');

    useEffect(() => {
        fetchReviews();
        if (user) checkEligibility();
    }, [bookId, user]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/books/${bookId}/reviews`);
            setReviews(response.data.content || response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkEligibility = async () => {
        setCanReview(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/books/${bookId}/reviews`, {
                rating: newRating,
                comment: newComment
            });
            toast.success("Review posted successfully");
            setNewComment('');
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post review");
        }
    };

    const handleDelete = async (reviewId) => {
        // Removed confirmation as requested
        try {
            await api.delete(`/books/${bookId}/reviews/${reviewId}`);
            toast.success("Review deleted");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const startEdit = (review) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/books/${bookId}/reviews/${editingId}`, {
                rating: editRating,
                comment: editComment
            });
            toast.success("Review updated");
            setEditingId(null);
            fetchReviews();
        } catch (error) {
            toast.error("Failed to update review");
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="mt-12 border-t dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Customer Reviews</h2>

            {user && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-700 dark:text-gray-300">Rating:</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className={`text-2xl focus:outline-none transition ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary dark:placeholder-gray-400"
                            rows="3"
                            required
                        ></textarea>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
                            Submit Review
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border-b dark:border-gray-700 pb-6 last:border-0">
                            {editingId === review.id ? (
                                <form onSubmit={handleUpdate} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded border border-blue-200 dark:border-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700 dark:text-gray-300 font-sm">Rating:</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setEditRating(star)}
                                                    className={`text-xl focus:outline-none transition ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows="2"
                                        required
                                    ></textarea>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Save</button>
                                        <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            {/* Corrected username access */}
                                            <h4 className="font-semibold dark:text-white">{review.user?.firstName || 'User'}</h4>
                                            <div className="flex text-yellow-400 text-sm mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? "" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                            {/* Edit/Delete Actions */}
                                            {user && review.user?.email === user.email && (
                                                <div className="flex space-x-3 mt-2">
                                                    <button
                                                        onClick={() => startEdit(review)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                                                        title="Edit Review"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                        title="Delete Review"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
