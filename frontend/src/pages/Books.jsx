/**
 * Books.jsx - Book Browsing Page
 * 
 * Displays paginated book catalog with:
 * - Search functionality with debounced input
 * - Category filtering
 * - Book card grid layout
 * - Pagination controls
 * - Empty state handling
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import BookCard from '../components/BookCard';
import { FaSearch, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Books = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle deep linking for categories
    useEffect(() => {
        const categoryName = searchParams.get('category');
        if (categoryName && categories.length > 0) {
            const matchedCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            if (matchedCategory) {
                setSelectedCategory(matchedCategory.id);
            }
        }
    }, [searchParams, categories]);

    useEffect(() => {
        fetchBooks(page, search, selectedCategory);
    }, [page, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchBooks = async (pageNo, searchQuery = '', categoryId = null) => {
        setLoading(true);
        try {
            let url = `/books?page=${pageNo}&size=8&search=${searchQuery}`;
            if (categoryId) {
                url += `&categoryId=${categoryId}`;
            }
            const response = await api.get(url);
            setBooks(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed to load books");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (page === 0) {
                fetchBooks(0, search, selectedCategory);
            } else {
                setPage(0);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null); // Toggle off
        } else {
            setSelectedCategory(categoryId);
        }
        setPage(0); // Reset to first page
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header & Search */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Explore Our Collection</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        Dive into a world of knowledge and imagination. Filter by category or search for your favorite titles.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:placeholder-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </form>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex justify-center space-x-3 min-w-max px-4">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === null
                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === category.id
                                    ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Book Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {books.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        {books.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="mx-auto h-20 w-20 text-primary flex justify-center items-center rounded-full bg-blue-100 mb-6">
                                    <FaBook size={40} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">No books found</h3>
                                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                    We couldn't find any books matching your search. Try different keywords or browse all categories.
                                </p>
                                <button
                                    onClick={() => { setSearch(''); setSelectedCategory(null); }}
                                    className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition font-medium"
                                >
                                    Browse All Books
                                </button>
                            </div>
                        ) : (
                            /* Pagination Controls */
                            <div className="mt-12 flex justify-center items-center">
                                <nav className="flex items-center space-x-1">
                                    {/* Previous Arrow */}
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className={`p-2 rounded-lg transition-colors ${page === 0
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, i) => {
                                        // Show first, last, current, and nearby pages
                                        const showPage = i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1;
                                        const showEllipsis = i === 1 && page > 2 || i === totalPages - 2 && page < totalPages - 3;

                                        if (showEllipsis && !showPage) {
                                            return <span key={i} className="px-2 text-gray-400">...</span>;
                                        }

                                        if (!showPage && !showEllipsis) return null;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-all ${page === i
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}

                                    {/* Next Arrow */}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages - 1}
                                        className={`p-2 rounded-lg transition-colors ${page === totalPages - 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Books;
