/**
 * Admin.jsx - Admin Dashboard Page
 * 
 * Administrative functions including:
 * - Book inventory management (CRUD operations)
 * - Category management
 * - Order management and status updates
 * - Requires ROLE_ADMIN permission
 */

import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';

import BookFormModal from '../components/admin/BookFormModal';

const Admin = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data.content || response.data);
        } catch (error) {
            toast.error("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/admin/books/${id}`);
            toast.success("Book deleted");
            fetchBooks();
        } catch (error) {
            toast.error("Failed to delete book");
        }
    };

    const openAddModal = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchBooks();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={openAddModal}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700"
                >
                    <FaPlus className="mr-2" /> Add Book
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map(book => (
                            <tr key={book.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{book.author}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">${book.price.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{book.stockQuantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(book)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteBook(book.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BookFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookToEdit={editingBook}
                onSave={handleSave}
            />
        </div>
    );
};

export default Admin;
