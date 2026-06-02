import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, loading, isSeller, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole === 'seller' && !isSeller && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
