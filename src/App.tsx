
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
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
);

export default App;
