import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatRoom from "./pages/chat/ChatRoom";
import PreEntranceCheck from "./pages/chat/PreEntranceCheck";
import LandingPage from "./pages/LandingPage";
import TestData from "./pages/TestData";

const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log("Protected route check - isAuthenticated:", isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

// Route guard for public routes (login/register)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log("Public route check - isAuthenticated:", isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Redirection par défaut vers la landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        
        {/* Landing page accessible à tous */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Test Data Page */}
        <Route path="/test" element={<TestData />} />
        
        {/* Authentication Routes */}
        <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Routes protégées */}
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
      <Toaster />
      <Sonner />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;