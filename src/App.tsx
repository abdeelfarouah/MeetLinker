import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatRoom from "./pages/chat/ChatRoom";
import PreEntranceCheck from "./pages/chat/PreEntranceCheck";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthenticatedRoute><Navigate to="/chat" replace /></AuthenticatedRoute>} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
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
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const AuthenticatedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/landing" replace />;
};

export default App;