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

// Generate a consistent avatar URL using Lovable's avatar service
const generateAvatar = (userId: string) => {
  return `https://lovable.dev/projects/c5605084-a0d7-49c9-ae7d-b58e254dc0bc`;
};

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <ScrollArea className="h-[500px] p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender.id === currentUserId;
          const avatarUrl = generateAvatar(message.sender.id);
          
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isCurrentUser ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${
                isCurrentUser ? 'items-end' : ''
              }`}>
                <span className="text-sm text-gray-500">{message.sender.name}</span>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;