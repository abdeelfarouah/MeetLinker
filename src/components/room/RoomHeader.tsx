
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface RoomHeaderProps {
  roomCode: string;
  handleLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ 
  roomCode, 
  handleLogout, 
  theme, 
  setTheme 
}) => {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b">
      <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'} text-foreground`}>
        Room: {roomCode}
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
        <Button
          variant="destructive"
          size={isMobile ? "sm" : "default"}
          onClick={handleLogout}
        >
          Exit
        </Button>
      </div>
    </header>
  );
};

export default RoomHeader;

