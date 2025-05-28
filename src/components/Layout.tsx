import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Camera, MessageCircle, FileText, HeartPulse } from "lucide-react";
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = () => {
  const { isProfileComplete, profile } = useUser();
  const { user } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const sidebarNavItems = [
    { path: '/chat', icon: MessageCircle, name: 'Chat' },
    { path: '/analyze', icon: Camera, name: 'Analyze Food' },
    { path: '/history', icon: FileText, name: 'History' },
    { path: '/experts', icon: HeartPulse, name: 'Experts' },
  ];

  const mobileNavItems = [
    { path: '/chat', icon: MessageCircle, name: 'Chat' },
    { path: '/analyze', icon: Camera, name: 'Analyze' },
    { path: '/history', icon: FileText, name: 'History' },
    { path: '/experts', icon: HeartPulse, name: 'Experts' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const displayName = profile.name || user?.name || user?.nickname || "User";

  return (
    <div className="flex h-screen bg-nari-secondary">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex md:flex-col md:w-64 border-r bg-white">
        <div className="p-4">
          <Link to="/chat" className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="Nari AI Logo" className="h-9 w-auto object-contain" />
            <h1 className="font-poppins font-semibold text-xl text-nari-text-main">Nari AI</h1>
          </Link>
          <p className="text-lg font-semibold text-nari-text-main mt-3 mb-1">Welcome, {displayName}</p>
        </div>
        <Separator className="my-2" />
        <nav className="flex-1 p-2 space-y-1">
          {sidebarNavItems.map((item) => (
            <Button 
              key={item.name}
              variant="ghost" 
              className={`w-full justify-start ${isActive(item.path) ? 'bg-nari-primary/10 text-nari-primary' : 'text-nari-text-main hover:bg-nari-primary/5'}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <header className="md:hidden p-4 border-b flex justify-between items-center bg-white">
          <Link to="/chat" className="flex items-center gap-2">
            <img src="/logo.png" alt="Nari AI Logo" className="h-8 w-auto object-contain" />
            <h1 className="font-poppins font-semibold text-lg text-nari-text-main">Nari AI</h1>
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6 text-nari-text-main" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="p-4 border-b">
                <Link to="/chat" className="flex items-center gap-2 mb-2">
                  <img src="/logo.png" alt="Nari AI Logo" className="h-8 w-auto object-contain" />
                  <h2 className="font-poppins font-semibold text-lg text-nari-text-main">Nari AI</h2>
                </Link>
                <p className="text-md font-semibold text-nari-text-main mt-3 mb-1">Welcome, {displayName}</p>
              </div>
              <Separator className="my-2" />
              <nav className="flex-1 p-2 space-y-1">
                {sidebarNavItems.map((item) => (
                  <Button 
                    key={item.name}
                    variant="ghost" 
                    className={`w-full justify-start ${isActive(item.path) ? 'bg-nari-primary/10 text-nari-primary' : 'text-nari-text-main hover:bg-nari-primary/5'}`}
                    onClick={() => { navigate(item.path); setIsSheetOpen(false); }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Button>
                ))}
              </nav>
              <div className="p-4 mt-auto border-t">
                <LogoutButton />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="md:hidden border-t p-2 flex justify-around">
          {mobileNavItems.map((item) => (
            <Button 
              key={item.name} 
              variant="ghost" 
              className={`flex flex-col items-center h-auto p-1 ${isActive(item.path) ? 'text-nari-primary' : 'text-nari-text-muted'}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
