import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string }>>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: message, sender: "user" }]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">Salon de discussion</h1>
      </header>
      
      <div className="flex flex-1 gap-4 p-4">
        <div className="flex w-3/4 flex-col">
          <Card className="flex-1">
            <ScrollArea className="h-[calc(100vh-12rem)] p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
            />
            <Button type="submit">Envoyer</Button>
          </form>
        </div>
        
        <Card className="w-1/4 p-4">
          <h2 className="mb-4 font-semibold">Participants</h2>
          <div className="space-y-2">
            {/* Liste des participants à implémenter */}
            <div className="text-sm text-gray-500">Aucun participant</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatRoom;