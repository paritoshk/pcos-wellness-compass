
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
import ManualAuthGuard from "./components/AuthGuard";

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
            <Route 
              path="/profile" 
              element={
                <ManualAuthGuard>
                  <ProfileSetup />
                </ManualAuthGuard>
              } 
            />
            <Route element={
              <ManualAuthGuard>
                <Layout />
              </ManualAuthGuard>
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
