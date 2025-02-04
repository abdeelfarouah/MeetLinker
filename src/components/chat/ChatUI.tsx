import React from 'react';
import { faker } from '@faker-js/faker/locale/fr';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatUI: React.FC = () => {
  // Generate one fake participant
  const participant = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    status: 'online' as const
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video area */}
            <div className="aspect-video bg-gray-100 rounded-lg shadow-lg">
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Video stream will appear here</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {/* Example message */}
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participant.name}</p>
                      <div className="mt-1 bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm">Welcome to the chat!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="mt-4 flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </div>
          </div>

          {/* Participants sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="font-semibold mb-4">Participants</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar>
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{participant.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;