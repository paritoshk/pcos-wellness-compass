
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
