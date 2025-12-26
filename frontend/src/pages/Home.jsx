/**
 * Home.jsx - Landing Page Component
 * 
 * The main landing page featuring:
 * - Hero section with animated elements
 * - Feature highlights (curated collections, community, fast delivery)
 * - Call-to-action buttons for browsing and registration
 * - Social proof with reader statistics
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaStar, FaArrowRight, FaHeart, FaUsers, FaShippingFast } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
            {/* Hero Section - Full Width Gradient */}
            <div className="relative">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-40 blur-3xl"></div>
                    <div className="absolute top-60 -left-20 w-60 h-60 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50 blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40">
                    <div className="text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-100 dark:border-gray-700 shadow-sm mb-8"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Over 10,000+ books available</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                        >
                            <span className="text-gray-900 dark:text-white">Your Next Great</span>
                            <br />
                            <span className="relative">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Adventure Awaits
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
                                    <path d="M0 6 Q 75 12 150 6 T 300 6" stroke="url(#underline-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="50%" stopColor="#9333ea" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-6 sm:mt-8 mx-auto max-w-2xl text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-4 sm:px-0"
                        >
                            Discover curated collections, instant access to thousands of titles,
                            and join a vibrant community of book lovers worldwide.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link
                                to="/books"
                                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:shadow-indigo-300 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <span>Browse Library</span>
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:bg-white transition-all duration-300"
                            >
                                Create Free Account
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-10 flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-300"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-9 h-9 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center shadow-md">
                                        <img src="https://i.pravatar.cc/36?img=1" alt="User" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center shadow-md">
                                        <img src="https://i.pravatar.cc/36?img=5" alt="User" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center shadow-md">
                                        <img src="https://i.pravatar.cc/36?img=8" alt="User" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center shadow-md">
                                        <img src="https://i.pravatar.cc/36?img=12" alt="User" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                                <span className="text-sm font-medium dark:text-white">5,000+ happy readers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <FaStar key={i} className="text-amber-400" />
                                ))}
                                <span className="ml-2 text-sm font-medium dark:text-white">4.9 rating</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section - Card Style */}
            <div className="relative py-12 bg-white/50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4"
                        >
                            Why Choose Us
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-gray-900 dark:text-white"
                        >
                            Reading Made <span className="text-indigo-600">Simple</span>
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Curated Collections',
                                icon: FaBookOpen,
                                desc: 'Every book handpicked by our expert team for quality and relevance.',
                                gradient: 'from-indigo-500 to-purple-500'
                            },
                            {
                                title: 'Lightning Fast',
                                icon: FaShippingFast,
                                desc: 'Instant digital access or same-day delivery for physical books.',
                                gradient: 'from-amber-500 to-orange-500'
                            },
                            {
                                title: 'Community Driven',
                                icon: FaUsers,
                                desc: 'Join discussions, share reviews, and connect with fellow readers.',
                                gradient: 'from-emerald-500 to-teal-500'
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-gray-100 dark:shadow-gray-900 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10K+', label: 'Books' },
                            { value: '5K+', label: 'Readers' },
                            { value: '500+', label: 'Authors' },
                            { value: '4.9', label: 'Rating' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-white"
                            >
                                <div className="text-4xl md:text-5xl font-black">{stat.value}</div>
                                <div className="mt-2 text-indigo-200 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-12 md:p-16 shadow-2xl shadow-indigo-200 dark:shadow-none"
                    >
                        <FaHeart className="mx-auto text-4xl text-pink-300 mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Reading?
                        </h2>
                        <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of book lovers and discover your next favorite story today.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 text-lg font-bold text-indigo-600 bg-white rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Get Started Free
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;
