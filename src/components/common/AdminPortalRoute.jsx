import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

const AdminPortalRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A0C14] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-3" />
        <p className="font-serif text-cream tracking-widest text-xs uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminPortalRoute;

