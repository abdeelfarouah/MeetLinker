import React from 'react';
import { faker } from '@faker-js/faker/locale/fr';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatUI: React.FC = () => {
  // Generate one fake participant
  const participant = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    status: 'online' as const
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary p-4 shadow-md">
        <h1 className="text-primary-foreground text-2xl font-bold">Chat Room</h1>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video area */}
          <div className="aspect-video bg-muted rounded-lg mb-4">
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Video stream will appear here</p>
            </div>
          </div>

          {/* Chat messages area */}
          <div className="flex-1 bg-card rounded-lg shadow-lg overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Example messages */}
                <div className="flex items-start gap-2">
                  <Avatar>
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Welcome to the chat!</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-md bg-muted p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Participants sidebar */}
        <div className="w-64 bg-card rounded-lg shadow-lg p-4">
          <h2 className="font-semibold mb-4">Participants</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
              <Avatar>
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>{participant.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{participant.name}</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Online</span>
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