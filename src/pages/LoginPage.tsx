import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from '@/contexts/UserContext';
import { toast } from "sonner";
import { LogIn, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, userAuth } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isNewUser = !userAuth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        toast.success(isNewUser ? "Account created successfully!" : "Login successful!");
        navigate('/profile');
      } else {
        toast.error("Invalid username or password");
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isNewUser ? "Create Account" : "Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {isNewUser 
              ? "Set up your account to access PCOS Wellness Compass" 
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pcos-input-focus"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pcos-input-focus"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-pcos hover:bg-pcos-dark flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{isNewUser ? "Create Account" : "Login"}</span>
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <p>Your data is secured and private</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
