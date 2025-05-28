import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // No longer needed directly here
import { useUser } from "@/contexts/UserContext";

const LogoutButton: React.FC = () => {
  // const navigate = useNavigate(); // Handled by logoutUser in context
  const { logoutUser } = useUser(); // Use the new logoutUser function
  
  const handleLogout = () => {
    logoutUser(); // Call the context function
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="ghost"
      className="flex items-center gap-2 hover:bg-red-100 hover:text-red-600 transition-colors w-full justify-start"
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
};

export default LogoutButton;
