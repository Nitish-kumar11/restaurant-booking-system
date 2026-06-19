import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import UserLayout   from './components/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import BookTable    from './pages/user/BookTable';
import MyBookings   from './pages/user/MyBookings';
import UserProfile  from './pages/user/UserProfile';

// Admin Pages
import AdminLayout    from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings  from './pages/admin/AdminBookings';
import AdminTables    from './pages/admin/AdminTables';
import AdminUsers     from './pages/admin/AdminUsers';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    {/* User routes */}
    <Route path="/dashboard" element={<PrivateRoute role="user"><UserLayout /></PrivateRoute>}>
      <Route index        element={<UserDashboard />} />
      <Route path="book"  element={<BookTable />} />
      <Route path="bookings" element={<MyBookings />} />
      <Route path="profile"  element={<UserProfile />} />
    </Route>

    {/* Admin routes */}
    <Route path="/admin" element={<PrivateRoute role="admin"><AdminLayout /></PrivateRoute>}>
      <Route index           element={<AdminDashboard />} />
      <Route path="bookings" element={<AdminBookings />} />
      <Route path="tables"   element={<AdminTables />} />
      <Route path="users"    element={<AdminUsers />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Inter, sans-serif', fontSize: '0.88rem' },
        success: { iconTheme: { primary: '#2D6A4F', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#E24B4A', secondary: '#fff' } },
      }} />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
