import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faker } from "@faker-js/faker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: string;
  isActive: boolean;
}

interface Participant {
  id: string;
  name: string;
  isActive: boolean;
  isHost: boolean;
  avatar: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Generate fake participants with French names
  const participants: Participant[] = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.firstName() + " " + faker.person.lastName(),
    isActive: faker.datatype.boolean(),
    isHost: faker.datatype.boolean(),
    avatar: faker.image.avatar(),
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Participants</h3>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${participant.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{participant.name}</p>
                <p className="text-xs text-gray-500">
                  {participant.isHost ? 'Hôte' : 'Participant'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
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
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;