import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useUser } from "@/contexts/UserContext"; // Not needed if just navigating
// import { toast } from "sonner"; // Not needed for this simplified action

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  // const { updateProfile } = useUser(); // We won't update profile here anymore

  const handleGetStarted = () => {
    // Simply navigate to the profile setup page.
    // The UserContext will be initialized with default (empty) values.
    // ProfileSetup.tsx will guide the user through creating their profile.
    navigate('/profile'); 
    // Optional: A toast message can be shown on the profile page itself if needed.
  };

  return (
    <div className="flex justify-center">
      <Button 
        onClick={handleGetStarted}
        className="bg-nari-primary hover:bg-nari-primary/90 flex items-center gap-2"
        size="lg"
      >
        <LogIn className="h-5 w-5" />
        <span>Get Started / Create Profile</span>
      </Button>
    </div>
  );
};

export default LoginButton;
