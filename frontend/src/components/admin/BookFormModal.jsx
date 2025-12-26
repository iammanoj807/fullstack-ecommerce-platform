import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toast } from 'react-toastify';
import { Dialog } from '@headlessui/react'; // Ensure package is installed or use simple modal

const BookFormModal = ({ isOpen, onClose, bookToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        title: '', author: '', description: '', price: '', stockQuantity: '', coverImageUrl: '', categoryId: ''
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (bookToEdit) {
            setFormData({
                title: bookToEdit.title,
                author: bookToEdit.author,
                description: bookToEdit.description || '',
                price: bookToEdit.price,
                stockQuantity: bookToEdit.stockQuantity,
                coverImageUrl: bookToEdit.coverImageUrl || '',
                categoryId: bookToEdit.category?.id || ''
            });
        } else {
            setFormData({ title: '', author: '', description: '', price: '', stockQuantity: '', coverImageUrl: '', categoryId: '' });
        }
    }, [bookToEdit]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                categoryId: parseInt(formData.categoryId) // Ensure ID is sent if logic requires. My backend might expect full object or ID.
                // Assuming backend BookRequest expects categoryId.
            };

            // Fix for backend: BookRequest likely needs category ID. 
            // My implementation of BookRequest: private Long categoryId;

            if (bookToEdit) {
                await api.put(`/api/admin/books/${bookToEdit.id}`, payload);
                toast.success("Book updated");
            } else {
                await api.post('/api/admin/books', payload);
                toast.success("Book created");
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save book");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" required className="w-full border p-2 rounded"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

                    <input type="text" placeholder="Author" required className="w-full border p-2 rounded"
                        value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />

                    <textarea placeholder="Description" className="w-full border p-2 rounded" rows="3"
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Price" step="0.01" required className="w-full border p-2 rounded"
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />

                        <input type="number" placeholder="Stock" required className="w-full border p-2 rounded"
                            value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} />
                    </div>

                    <input type="url" placeholder="Cover Image URL" className="w-full border p-2 rounded"
                        value={formData.coverImageUrl} onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })} />

                    <select className="w-full border p-2 rounded" required
                        value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;
