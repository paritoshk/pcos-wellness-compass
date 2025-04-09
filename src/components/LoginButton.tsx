
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button 
      onClick={() => loginWithRedirect()}
      className="bg-pcos hover:bg-pcos-dark flex items-center gap-2"
      size="lg"
    >
      <LogIn className="h-5 w-5" />
      <span>Get Started</span>
    </Button>
  );
};

export default LoginButton;
