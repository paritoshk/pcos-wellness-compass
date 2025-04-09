
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <Button 
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      })}
      variant="ghost"
      className="flex items-center gap-2 hover:bg-red-100 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
};

export default LogoutButton;
