/**
 * Footer.jsx - Site Footer Component
 * 
 * Displays site footer with:
 * - Brand information and description
 * - Social media links
 * - Quick navigation links
 * - Category links
 * - Copyright and legal links
 */

import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaGlobe, FaBookOpen } from 'react-icons/fa';

/**
 * Footer Component
 * Renders the site footer with navigation and social links
 */
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-2xl">
                            <FaBookOpen className="text-indigo-400" />
                            <span>Novela</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Discover a world of stories. From timeless classics to modern masterpieces, we bring the best books to your doorstep.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex gap-4 pt-2">
                            <a href="https://github.com/iammanoj807" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all transform hover:-translate-y-1">
                                <FaGithub size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/manoj-kumar-thapa-7595a5168" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all transform hover:-translate-y-1">
                                <FaLinkedin size={18} />
                            </a>
                            <a href="https://iammanoj807.github.io/profile/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <FaGlobe size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Home</Link></li>
                            <li><Link to="/books" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Browse Books</Link></li>
                            <li><Link to="/register" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Register</Link></li>
                            <li><a href="https://github.com/iammanoj807" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Contact Support</a></li>
                        </ul>
                    </div>

                    {/* Categories Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Top Categories</h3>
                        <ul className="space-y-3">
                            <li><Link to="/books?category=Fiction" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Fiction</Link></li>
                            <li><Link to="/books?category=Non-Fiction" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Non-Fiction</Link></li>
                            <li><Link to="/books?category=Science" className="hover:text-indigo-400 transition ml-2 hover:ml-3">Science</Link></li>
                            <li><Link to="/books?category=History" className="hover:text-indigo-400 transition ml-2 hover:ml-3">History</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar - Copyright and Legal */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; Novela 2025 </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition">Terms of Service</Link>
                        <Link to="#" className="hover:text-white transition">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
