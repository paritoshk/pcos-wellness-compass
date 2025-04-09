
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Utensils, Activity, FileText, HeartHandshake, Shield, LogIn } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isProfileComplete } = useUser();

  useEffect(() => {
    // If user is authenticated and has completed profile setup, redirect to chat
    if (isAuthenticated) {
      if (isProfileComplete) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, isProfileComplete, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <header className="w-full p-6">
        <h1 className="text-3xl font-bold gradient-text">PCOS Wellness Compass</h1>
      </header>
      
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Your Personal PCOS Health Assistant</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized guidance for PCOS-friendly food choices and lifestyle recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center group hover:scale-105">
              <div className="h-16 w-16 bg-pcos/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-pcos/20">
                <Utensils className="h-8 w-8 text-pcos" />
              </div>
              <h3 className="font-semibold text-xl">Food Analysis</h3>
              <p className="text-sm text-muted-foreground mt-2">Instantly analyze meals for PCOS compatibility</p>
            </div>
            
            <div className="bg-card backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center group hover:scale-105">
              <div className="h-16 w-16 bg-pcos/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-pcos/20">
                <Activity className="h-8 w-8 text-pcos" />
              </div>
              <h3 className="font-semibold text-xl">Personalized Advice</h3>
              <p className="text-sm text-muted-foreground mt-2">Get recommendations tailored to your PCOS profile</p>
            </div>
            
            <div className="bg-card backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center group hover:scale-105">
              <div className="h-16 w-16 bg-pcos/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-pcos/20">
                <FileText className="h-8 w-8 text-pcos" />
              </div>
              <h3 className="font-semibold text-xl">Food Tracking</h3>
              <p className="text-sm text-muted-foreground mt-2">Log meals and monitor your progress</p>
            </div>
            
            <div className="bg-card backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center group hover:scale-105">
              <div className="h-16 w-16 bg-pcos/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-pcos/20">
                <HeartHandshake className="h-8 w-8 text-pcos" />
              </div>
              <h3 className="font-semibold text-xl">Expert Connect</h3>
              <p className="text-sm text-muted-foreground mt-2">Connect with PCOS nutritionists</p>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col items-center">
            <div className="flex justify-center w-full">
              <Button 
                onClick={handleGetStarted}
                className="bg-pcos hover:bg-pcos-dark flex items-center gap-2 px-8 py-6 text-lg"
                size="lg"
              >
                <LogIn className="h-5 w-5" />
                <span>Get Started</span>
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <p>Your data is secured and private</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
