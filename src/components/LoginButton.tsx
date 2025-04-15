
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUser();

  const handleGetStarted = () => {
    // Set a default user name if profile isn't set yet
    updateProfile({
      name: "Guest User", 
      completedSetup: true
    });
    
    // Navigate to the chat page
    navigate('/chat');
    
    toast.success("Welcome to PCOS Wellness Compass!");
  };

  return (
    <div className="flex justify-center">
      <Button 
        onClick={handleGetStarted}
        className="bg-pcos hover:bg-pcos-dark flex items-center gap-2"
        size="lg"
      >
        <LogIn className="h-5 w-5" />
        <span>Get Started</span>
      </Button>
    </div>
  );
};

export default LoginButton;
