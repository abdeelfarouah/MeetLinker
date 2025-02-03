import React, { useEffect, useRef } from 'react';
import { Monitor, X } from 'lucide-react';

type ScreenShareProps = {
  screenShareStream: MediaStream | null;
  onEndScreenShare: () => void;
};

const ScreenShare: React.FC<ScreenShareProps> = ({ screenShareStream, onEndScreenShare }) => {
  const screenShareRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (screenShareStream && screenShareRef.current) {
      screenShareRef.current.srcObject = screenShareStream;

      const track = screenShareStream.getVideoTracks()[0];
      track.onended = onEndScreenShare;

      return () => {
        track.onended = null;
      };
    }
  }, [screenShareStream, onEndScreenShare]);

  if (!screenShareStream) return null;

  return (
    <div className="relative w-full h-72 lg:h-[400px]">
      <video
        ref={screenShareRef}
        autoPlay
        muted
        className="w-full h-full object-contain bg-black rounded-lg shadow-md"
      />
      <button
        onClick={onEndScreenShare}
        className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
        title="Stop sharing"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white rounded-full">
        <Monitor className="w-4 h-4" />
        <span className="text-sm font-medium">Screen Share</span>
      </div>
    </div>
  );
};

export default ScreenShare;