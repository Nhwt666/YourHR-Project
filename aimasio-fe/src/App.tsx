import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Results from "./pages/Results";
import History from "./pages/History";
import CvReview from "./pages/CvReview";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import { getStoredToken } from "./lib/api";
import { LanguageProvider } from "./i18n/LanguageContext";
import SupportChatBubble from "./components/SupportChatBubble";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!getStoredToken()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/interview-setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
            <Route path="/live-interview" element={<ProtectedRoute><LiveInterview /></ProtectedRoute>} />
            <Route path="/cv-review" element={<ProtectedRoute><CvReview /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SupportChatBubble />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
