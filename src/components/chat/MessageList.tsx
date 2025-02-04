import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <ScrollArea className="h-[500px] p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender.id === currentUserId ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar>
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div className={`flex flex-col ${
              message.sender.id === currentUserId ? 'items-end' : ''
            }`}>
              <span className="text-sm text-gray-500">{message.sender.name}</span>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender.id === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;