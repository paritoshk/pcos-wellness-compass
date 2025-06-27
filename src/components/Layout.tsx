import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, LogOut, MessageCircle, Camera, FileText, HeartPulse } from 'lucide-react';

const Layout = () => {
  const { isProfileComplete, profile } = useUser();
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isProfileComplete === false) { // Explicitly check for false to avoid issues during initial load
      navigate('/profile');
    }
  }, [isProfileComplete, navigate]);

  const navItems = [
    { path: '/chat', name: 'Chat', icon: MessageCircle },
    { path: '/analyze', name: 'Analyze Food', icon: Camera },
    { path: '/history', name: 'History', icon: FileText },
    { path: '/experts', name: 'Experts', icon: HeartPulse },
  ];

  const displayName = profile.name || user?.name || user?.nickname || "User";
  const userImage = user?.picture || '';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/chat" className="flex items-center gap-2">
            <img src="/logo.png" alt="Nari AI Logo" className="h-9 w-auto object-contain" />
            <h1 className="font-poppins font-semibold text-xl text-foreground hidden sm:block">Nari AI</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={location.pathname.startsWith(item.path) ? "secondary" : "ghost"}
                className="text-sm font-medium"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={userImage} alt={displayName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem disabled>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.name} onClick={() => navigate(item.path)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
