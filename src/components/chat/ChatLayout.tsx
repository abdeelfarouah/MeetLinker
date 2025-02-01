import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">MeetLinker Chat</h1>
            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/pre-entrance/new")}
              >
                New Meeting
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default ChatLayout;