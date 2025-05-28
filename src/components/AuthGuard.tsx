import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const ManualAuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isProfileComplete } = useUser();
  const location = useLocation();

  // For routes protected by this guard, if profile is not complete, redirect to profile setup.
  // The Welcome page (/) is not protected by this version of the guard.
  // ProfileSetup page will also not be protected by this to allow access.
  if (!isProfileComplete) {
    // Allow access to /profile even if not complete yet.
    // Other routes (chat, analyze, etc.) will be implicitly protected by Layout requiring profile completion.
    // This specific guard instance in App.tsx wraps Layout, so this check is for Layout children.
    if (location.pathname !== '/profile') {
        // Redirect to profile page to complete setup if trying to access other protected routes.
        // If they are already on /profile, let them stay.
        return <Navigate to="/profile" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default ManualAuthGuard;
