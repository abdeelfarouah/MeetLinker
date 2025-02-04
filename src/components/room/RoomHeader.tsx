import React from 'react';
import { Button } from "@/components/ui/button";

interface RoomHeaderProps {
  roomCode: string;
  handleLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ roomCode, handleLogout, theme, setTheme }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Room: {roomCode}</h1>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default RoomHeader;