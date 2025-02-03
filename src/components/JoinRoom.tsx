import React from 'react';
import { Video } from 'lucide-react';

type JoinRoomProps = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  handleJoinRoom: (e: React.FormEvent) => void;
  handleLogout: () => void;
};

const JoinRoom: React.FC<JoinRoomProps> = ({ roomCode, setRoomCode, handleJoinRoom, handleLogout }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <Video className="w-12 h-12 text-blue-500" />
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Join Video Chat</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">
          Logout
        </button>
      </div>
      <form onSubmit={handleJoinRoom} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter room code"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
          Join Room
        </button>
      </form>
    </div>
  </div>
);

export default JoinRoom;
