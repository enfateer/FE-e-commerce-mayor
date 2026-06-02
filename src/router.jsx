import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import SellerProfile from './pages/SellerProfile';

// Authenticated Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Notifications from './pages/Notifications';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ManageServices from './pages/seller/ManageServices';
import ServiceForm from './pages/seller/ServiceForm';
// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminServices from './pages/admin/AdminServices';

const router = createBrowserRouter([
  // Public routes with MainLayout
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <Services /> },
      { path: '/services/:id', element: <ServiceDetail /> },
      { path: '/sellers/:id', element: <SellerProfile /> },
    ],
  },

  // Auth pages (no layout - full page)
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Protected routes - authenticated users (DashboardLayout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/profile', element: <Profile /> },
          { path: '/orders', element: <Orders /> },
          { path: '/orders/:id', element: <OrderDetail /> },
          { path: '/notifications', element: <Notifications /> },
        ],
      },
    ],
  },

  // Seller routes
  {
    element: <ProtectedRoute requiredRole="seller" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/seller', element: <Navigate to="/seller/dashboard" replace /> },
          { path: '/seller/dashboard', element: <SellerDashboard /> },
          { path: '/seller/services', element: <ManageServices /> },
          { path: '/seller/services/new', element: <ServiceForm /> },
          { path: '/seller/services/:id/edit', element: <ServiceForm /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/admin', element: <Navigate to="/admin/reports" replace /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/sellers', element: <AdminSellers /> },
          { path: '/admin/reports', element: <AdminReports /> },
          { path: '/admin/notifications', element: <AdminNotifications /> },
          { path: '/admin/services', element: <AdminServices /> },
        ],
      },
    ],
  },
]);

export default router;
