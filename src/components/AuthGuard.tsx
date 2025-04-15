
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const ManualAuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { profile, updateProfile } = useUser();
  
  // Check if user has a name in the profile
  if (profile.name === '') {
    // Auto-create a guest profile instead of redirecting
    updateProfile({
      name: "Guest User",
      completedSetup: true
    });
  }

  // Always render children since we create a guest profile if needed
  return <>{children}</>;
};

export default ManualAuthGuard;
