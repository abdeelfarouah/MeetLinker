import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: string;
  isActive: boolean;
}

const ChatLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    console.log("User connected to chat:", user);
    toast({
      title: "Connected!",
      description: "You are now online in the chat room.",
    });

    // Simulate receiving a welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Welcome ${user.username}! You are now online.`,
      sender: "system",
      isActive: true,
    };
    setMessages([welcomeMessage]);
  }, [user, navigate]);

  const handleSendMessage = (text: string) => {
    console.log("Sending message:", text);
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      isActive: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4 bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="font-medium">Online</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 bg-card rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold mb-4">Video Chat</h2>
              {/* Video components will be added here */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video chat coming soon...</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-card rounded-lg p-4 h-[calc(100vh-12rem)]">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;