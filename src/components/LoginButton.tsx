
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate('/profile')}
      className="bg-pcos hover:bg-pcos-dark flex items-center gap-2"
      size="lg"
    >
      <LogIn className="h-5 w-5" />
      <span>Get Started</span>
    </Button>
  );
};

export default LoginButton;
