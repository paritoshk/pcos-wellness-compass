
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const ManualAuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { profile } = useUser();
  
  // For our manual auth, we'll consider a user "logged in" if they've interacted with the app
  // We'll use the presence of a name in the profile as an indicator
  const isAuthenticated = profile.name !== '';

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ManualAuthGuard;
