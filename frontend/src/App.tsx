import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Technology from "./pages/Technology";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import ResumeParser from "./pages/ResumeParser";
import EmailTemplates from "./pages/EmailTemplates";
import AIAssistant from "./pages/AIAssistant";
import Assessments from "./pages/Assessments";
import Preferences from "./pages/Preferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* For admin-only routes, use: */}
            {/* <ProtectedRoute adminOnly={true}>
              <AdminOnlyComponent />
            </ProtectedRoute> */}
            
            {/* Protected routes - accessible to all authenticated users (recruiters and admins) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <ProtectedRoute>
                  <Candidates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume-parser" 
              element={
                <ProtectedRoute>
                  <ResumeParser />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email-templates" 
              element={
                <ProtectedRoute>
                  <EmailTemplates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-assistant" 
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessments" 
              element={
                <ProtectedRoute>
                  <Assessments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
