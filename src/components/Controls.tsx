import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';

type ControlsProps = {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
};

const Controls: React.FC<ControlsProps> = ({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onScreenShare,
}) => {
  return (
    <div className="flex justify-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full transition-colors ${
          isMuted 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-colors ${
          isVideoOff 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white'
        }`}
        title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
      >
        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </button>

      <button
        onClick={onScreenShare}
        className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
        title="Share Screen"
      >
        <Monitor className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Controls;