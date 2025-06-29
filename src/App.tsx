import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import ChatInterface from "./pages/ChatInterface";
import FoodAnalysis from "./pages/FoodAnalysis";
import HistoryLog from "./pages/HistoryLog";
import ExpertConnect from "./pages/ExpertConnect";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import AuthGuard from "./components/AuthGuard";
import PcosQuiz from "./pages/PcosQuiz";

const App = () => (
  <UserProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/quiz" element={<PcosQuiz />} />
        <Route 
          element={
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
  </UserProvider>
);

export default App;
