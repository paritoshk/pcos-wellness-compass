
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import WelcomePage from "./pages/WelcomePage";
import ProfileSetup from "./pages/ProfileSetup";
import ChatInterface from "./pages/ChatInterface";
import FoodAnalysis from "./pages/FoodAnalysis";
import HistoryLog from "./pages/HistoryLog";
import ExpertConnect from "./pages/ExpertConnect";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

// Auth0 domain and client ID
const AUTH0_DOMAIN = "dev-4xkd4j2dtjlsomra.us.auth0.com";
const AUTH0_CLIENT_ID = "XpEPlYFXeEvVefepy5GtW0Sz340dZz1p";

const App = () => (
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
  >
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route 
                path="/profile" 
                element={
                  <AuthGuard>
                    <ProfileSetup />
                  </AuthGuard>
                } 
              />
              <Route element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/analyze" element={<FoodAnalysis />} />
                <Route path="/history" element={<HistoryLog />} />
                <Route path="/experts" element={<ExpertConnect />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  </Auth0Provider>
);

export default App;
