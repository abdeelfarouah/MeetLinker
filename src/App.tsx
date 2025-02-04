import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatRoom from "./pages/chat/ChatRoom";
import PreEntranceCheck from "./pages/chat/PreEntranceCheck";
import LandingPage from "./pages/LandingPage";
import ChatUI from '@/components/chat/ChatUI';

const queryClient = new QueryClient();

// Wrapper component to conditionally render ChatUI
const ChatUIWrapper = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes('/chat') || location.pathname.includes('/pre-entrance');
  
  console.log('Current route:', location.pathname, 'Should show ChatUI:', isChatRoute);
  
  return isChatRoute ? <ChatUI /> : null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing page for non-authenticated users */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } 
              />
              
              {/* Public routes */}
              <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
              <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Protected routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Navigate to="/pre-entrance/new" replace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pre-entrance/:roomId" 
                element={
                  <ProtectedRoute>
                    <PreEntranceCheck />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/:roomId" 
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatUIWrapper />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log("Protected route check - isAuthenticated:", isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

// Route guard for public routes (login/register/landing)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log("Public route check - isAuthenticated:", isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
  return children;
};

export default App;