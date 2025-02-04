import { LogOut } from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle';

interface RoomHeaderProps {
  roomCode: string;
  handleLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const RoomHeader = ({ roomCode, handleLogout, theme, setTheme }: RoomHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Room: {roomCode}</h1>
      <div className="flex items-center gap-4">
        <DarkModeToggle theme={theme} setTheme={setTheme} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;