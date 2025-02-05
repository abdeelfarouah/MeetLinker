import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { decryptMessage } from '@/utils/crypto';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

// Generate a consistent avatar URL using Lovable's avatar service
const generateAvatar = (userId: string) => {
  return `https://lovable.dev/projects/c5605084-a0d7-49c9-ae7d-b58e254dc0bc`;
};

const MessageList = ({ messages, currentUser }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[500px]">
      <div ref={scrollRef} className="p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender === currentUser.name;
          const decryptedContent = decryptMessage(msg.content);
          const avatarUrl = generateAvatar(isCurrentUser ? currentUser.id : msg.id);
          
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isCurrentUser ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{msg.sender[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col ${
                isCurrentUser ? 'items-end' : 'items-start'
              }`}>
                <span className="text-sm text-gray-500">{msg.sender}</span>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {decryptedContent}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
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