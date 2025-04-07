
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';

const WelcomePage: React.FC = () => {
  const { isProfileComplete } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If profile is already complete, redirect to chat
    if (isProfileComplete) {
      navigate('/chat');
    }
  }, [isProfileComplete, navigate]);

  const handleGetStarted = () => {
    navigate('/profile');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <img 
            src="/placeholder.svg" 
            alt="PCOS Wellness Compass Logo" 
            className="mx-auto h-24 w-24 rounded-full bg-pcos/10 p-4"
          />
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            PCOS Wellness Compass
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personalized guide for navigating life with PCOS
          </p>
        </div>

        <div className="space-y-6 mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center p-4 rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-pcos/10 p-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pcos/20 flex items-center justify-center text-pcos">
                  📸
                </div>
              </div>
              <h3 className="font-medium">Food Analysis</h3>
              <p className="text-sm text-muted-foreground text-center">
                Analyze foods for PCOS compatibility
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-pcos-teal/10 p-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pcos-teal/20 flex items-center justify-center text-pcos-teal">
                  💬
                </div>
              </div>
              <h3 className="font-medium">Personalized Chat</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get PCOS-specific guidance
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-pcos-peach/10 p-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pcos-peach/20 flex items-center justify-center text-pcos-peach">
                  📋
                </div>
              </div>
              <h3 className="font-medium">Symptom Tracking</h3>
              <p className="text-sm text-muted-foreground text-center">
                Log and monitor your symptoms
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-pcos-light/10 p-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pcos-light/20 flex items-center justify-center text-pcos-light">
                  👩‍⚕️
                </div>
              </div>
              <h3 className="font-medium">Expert Connect</h3>
              <p className="text-sm text-muted-foreground text-center">
                Connect with PCOS specialists
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleGetStarted}
            className="w-full bg-pcos hover:bg-pcos-dark text-white"
            size="lg"
          >
            Get Started
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Your data stays private and secure on your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
