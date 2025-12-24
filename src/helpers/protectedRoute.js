import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, redirectTo }) => {
  const user = useAuth();
  if (!user) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return children;
};
