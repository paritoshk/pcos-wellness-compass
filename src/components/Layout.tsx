
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Camera, MessageCircle, FileText, HeartPulse } from "lucide-react";
import LogoutButton from './LogoutButton';

const Layout = () => {
  const { isProfileComplete, profile } = useUser();
  const { user } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If profile is not complete, redirect to profile setup
    if (!isProfileComplete) {
      navigate('/profile');
    }
  }, [isProfileComplete, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/chat', icon: <MessageCircle className="h-5 w-5" />, label: 'Chat' },
    { path: '/analyze', icon: <Camera className="h-5 w-5" />, label: 'Analyze Food' },
    { path: '/history', icon: <FileText className="h-5 w-5" />, label: 'History' },
    { path: '/experts', icon: <HeartPulse className="h-5 w-5" />, label: 'Experts' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const displayName = profile.name || user?.name || user?.nickname || "User";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-xl gradient-text">PCOS Pal</h1>
          </div>
          <div className="text-sm text-muted-foreground">Hi, {displayName}</div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden" onClick={toggleMobileMenu}>
          <div className="absolute left-0 top-0 h-full w-64 bg-card shadow-lg p-4" onClick={e => e.stopPropagation()}>
            <div className="space-y-4 mt-12">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? 'bg-pcos/10 text-pcos' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
              <Separator />
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 border-r">
        <div className="p-4">
          <h1 className="font-semibold text-xl gradient-text">PCOS Wellness Compass</h1>
          <p className="text-sm text-muted-foreground mt-1">Hi, {displayName}</p>
        </div>
        
        <Separator />
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive(item.path) ? 'bg-pcos/10 text-pcos' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[60px] md:pt-0">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
