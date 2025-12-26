/**
 * App.jsx - Main Application Entry Point
 * 
 * This file sets up the React application with:
 * - React Router for client-side navigation
 * - Authentication context for user session management
 * - Cart context for shopping cart state
 * - Protected routes for authenticated pages
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Page Components
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication or admin privileges
 * Redirects unauthenticated users to login page
 * Redirects non-admin users to home if adminOnly is true
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" />;

  // Redirect to home if admin access required but user is not admin
  if (adminOnly && (!user.roles || !user.roles.includes('ROLE_ADMIN'))) {
    return <Navigate to="/" />;
  }

  return children;
};

/**
 * App Component
 * Root component that provides context providers and routing
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* All routes wrapped in Layout for consistent header/footer */}
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="books" element={<Books />} />
                <Route path="books/:id" element={<BookDetails />} />
                <Route path="cart" element={<Cart />} />

                {/* Protected Routes - Require Authentication */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="order-success" element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                } />

                {/* Admin Only Route */}
                <Route path="admin" element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                } />

                {/* 404 Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
