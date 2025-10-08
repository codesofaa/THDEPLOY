import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Element, requiredRole, ...rest }) => {
  const { isAuthenticated, userRole } = useAuth();

  return isAuthenticated && (!requiredRole || userRole === requiredRole)
    ? <Element {...rest} />
    : <Navigate to="/" />;
};

export default ProtectedRoute;
