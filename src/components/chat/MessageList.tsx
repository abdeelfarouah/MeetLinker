import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { faker } from '@faker-js/faker/locale/fr';

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

const MessageList = ({ messages, currentUser }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const participants = [
    currentUser,
    ...Array.from({ length: 4 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    }))
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-2">Participants</h3>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
                {participant.id === currentUser.id && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {participant.name} {participant.id === currentUser.id && '(Vous)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === currentUser.name ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex-1 max-w-[80%]">
                  <p className="text-sm font-medium">{msg.sender}</p>
                  <div className={`rounded-lg p-3 ${
                    msg.sender === currentUser.name 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-gray-100'
                  }`}>
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MessageList;