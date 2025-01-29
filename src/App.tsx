import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import de useAuth pour vérifier l'authentification
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatRoom from "./pages/chat/ChatRoom";

// Utilisation de QueryClient pour gérer les requêtes asynchrones
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth(); // Vérifie si l'utilisateur est authentifié
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 text-white">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Welcome to MeetLinker
        </h1>
        <p className="text-xl mb-6">
          Experience seamless video meetings for personal or professional connections, wherever you are.
        </p>
        <a
          href="/auth/login"
          className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </a>
      </div>

      <div className="flex flex-wrap justify-center gap-12 mt-16">
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg max-w-xs">
          <div className="w-24 h-24 bg-indigo-700 text-white rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <path d="M12 10v3m0 0v3m0-3h3m-3 0H9" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Instant Video Calls</h3>
          <p className="text-gray-600 text-center">
            Start a video call instantly and connect with anyone, anywhere, at any time.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg max-w-xs">
          <div className="w-24 h-24 bg-purple-600 text-white rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <path d="M16 2h6v6M2 16h6v6M2 2l20 20" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Join Meetings Anytime</h3>
          <p className="text-gray-600 text-center">
            Join scheduled or impromptu meetings with ease, no matter the time zone.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg max-w-xs">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <path d="M4 6H20M4 12H20M4 18H20" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Screen Sharing</h3>
          <p className="text-gray-600 text-center">
            Share your screen effortlessly for a more interactive meeting experience.
          </p>
        </div>
      </div>

      <footer className="w-full py-4 bg-gray-800 text-white text-center mt-16">
        <p>© 2025 MeetLinker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;


