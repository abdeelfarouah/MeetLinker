import React, { useRef, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';

type VideoStreamProps = {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
};

const VideoStream: React.FC<VideoStreamProps> = ({ stream, isMuted, isVideoOff }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        muted={isMuted}
        className={`w-full h-full object-cover rounded-lg shadow-md ${
          isVideoOff ? 'hidden' : ''
        }`}
      />
      {isVideoOff && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg shadow-md flex flex-col items-center justify-center gap-4">
          <CameraOff className="w-12 h-12 text-gray-400" />
          <span className="text-gray-300 text-lg font-medium">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default VideoStream;