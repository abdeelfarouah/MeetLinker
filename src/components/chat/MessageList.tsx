import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faker } from "@faker-js/faker";

interface Message {
  id: string;
  text: string;
  sender: string;
  isActive: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Faire défiler vers le bas lorsqu'un nouveau message est ajouté
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-28rem)] p-4">
      <div className="space-y-4">
        {messages.map((msg) => {
          // Génération d'un participant factice avec un statut actif ou non
          const isActive = faker.datatype.boolean();
          const participantName = faker.internet.userName();

          return (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-semibold">{participantName}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
