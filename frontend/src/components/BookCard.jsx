/**
 * BookCard.jsx - Book Display Card Component
 * 
 * Reusable card component for displaying book information:
 * - Cover image with hover effect
 * - Title, author, and price
 * - Star rating display
 * - Link to book details page
 * - Supports dark mode
 */

import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const BookCard = ({ book }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-800 transition flex flex-col h-full">
            <Link to={`/books/${book.id}`} className="block relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        No Image
                    </div>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/books/${book.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1 hover:text-primary mb-1">{book.title}</h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{book.author}</p>

                <div className="flex items-center mb-3">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {book.ratingAverage ? book.ratingAverage.toFixed(1) : 'New'}
                        <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({book.ratingCount || 0})</span>
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${book.price.toFixed(2)}</span>
                    <Link
                        to={`/books/${book.id}`}
                        className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
