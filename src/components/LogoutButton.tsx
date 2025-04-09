
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  
  const handleLogout = () => {
    // Properly logout using our authentication system
    logout();
    // Navigate to welcome page
    navigate('/');
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="ghost"
      className="flex items-center gap-2 hover:bg-red-100 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
};

export default LogoutButton;
