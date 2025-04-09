
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/contexts/UserContext';
import LoginButton from '@/components/LoginButton';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();
  const { isProfileComplete } = useUser();

  useEffect(() => {
    // If user is authenticated and has completed profile setup, redirect to chat
    if (isAuthenticated && !isLoading) {
      if (isProfileComplete) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pcos"></div>
      </div>
    );
  }

  // Only show the welcome page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-background to-muted">
          <div className="w-full max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold gradient-text">PCOS Wellness Compass</h1>
            <p className="text-xl text-muted-foreground">Your personalized guide for PCOS-friendly food choices</p>
            
            <div className="space-y-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">AI Food Analysis</h3>
                  <p className="text-sm text-muted-foreground">Instantly analyze any meal for PCOS compatibility</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">Personalized Advice</h3>
                  <p className="text-sm text-muted-foreground">Get recommendations tailored to your PCOS profile</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">Food Tracking</h3>
                  <p className="text-sm text-muted-foreground">Log your meals and track your progress</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">Expert Connect</h3>
                  <p className="text-sm text-muted-foreground">Connect with PCOS nutritionists</p>
                </div>
              </div>
              
              <div className="pt-4">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This return should never be reached due to redirects
  return null;
};

export default WelcomePage;
