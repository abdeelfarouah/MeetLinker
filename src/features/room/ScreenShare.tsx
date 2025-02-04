import React, { useEffect, useRef } from 'react';
import { Monitor, X } from 'lucide-react';

interface ScreenShareProps {
  stream: MediaStream | null;
  onEndShare: () => void;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ stream, onEndShare }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <div className="relative w-full h-72 lg:h-[400px]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain bg-black rounded-lg"
      />
      <button
        onClick={onEndShare}
        className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white rounded-full">
        <Monitor className="w-4 h-4" />
        <span className="text-sm">Screen Share</span>
      </div>
    </div>
  );
};

export default ScreenShare;