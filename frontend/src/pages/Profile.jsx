/**
 * Profile.jsx - User Profile Page
 * 
 * User account management with:
 * - Profile information display and editing
 * - Password change functionality
 * - Account deletion option
 * - User's review history
 */

import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            if (response.data) {
                setProfile({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email
                });
            }
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/me', {
                firstName: profile.firstName,
                lastName: profile.lastName
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }
        try {
            await api.put('/users/me/password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password changed successfully");
            setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        }
    };

    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const expectedDeleteText = `Delete ${profile.firstName} Account`;
    const canDelete = deleteConfirmText === expectedDeleteText;

    const handleDeleteAccount = async () => {
        if (!canDelete) {
            toast.error(`Please type "${expectedDeleteText}" to confirm`);
            return;
        }
        try {
            await api.delete('/users/me');
            logout();
            toast.info("Your account has been deleted.");
        } catch (error) {
            toast.error("Failed to delete account.");
        }
    };

    const [activeTab, setActiveTab] = useState('account');

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    // ... existing fetch logic ...

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <nav className="flex flex-col p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-primary text-white shadow-md shadow-blue-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <span className="mr-3">👤</span> Account Details
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary text-white shadow-md shadow-blue-200 dark:shadow-none' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <span className="mr-3">🔒</span> Security
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow">
                    {activeTab === 'account' ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                    <input type="email" value={profile.email} disabled className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                                <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwords.oldPassword}
                                            onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.confirmNewPassword}
                                            onChange={e => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition shadow-lg">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-8 mt-8">
                                <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
                                <p className="text-gray-600 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    To confirm, type <span className="font-mono font-bold text-red-600">"{expectedDeleteText}"</span> below:
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={e => setDeleteConfirmText(e.target.value)}
                                    placeholder={expectedDeleteText}
                                    className="w-full max-w-md px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <div className="mt-6">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={!canDelete}
                                        className={`px-6 py-2 font-medium rounded-lg transition shadow-lg ${canDelete ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
