
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button 
      onClick={() => loginWithRedirect()}
      className="bg-pcos hover:bg-pcos-dark"
      size="lg"
    >
      Get Started
    </Button>
  );
};

export default LoginButton;
