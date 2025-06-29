import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader, Center } from '@mantine/core';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isProfileComplete, authIsLoading: isUserContextLoading } = useUser();
  const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();

  // Combine loading states from Auth0 and our UserContext
  const isLoading = isAuth0Loading || isUserContextLoading;

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="pink" />
      </Center>
    );
  }

  // If the user is not logged in via Auth0, redirect them to the home page
  // where they can use the Login button.
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user IS logged in, but they haven't completed the quiz,
  // send them to the quiz.
  if (isAuthenticated && !isProfileComplete) {
    return <Navigate to="/quiz" replace />;
  }
  
  // If the user is authenticated AND has completed the quiz, show the requested page.
  return <>{children}</>;
};

export default AuthGuard;
