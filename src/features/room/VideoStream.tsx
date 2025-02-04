import React, { useRef, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface VideoStreamProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

const VideoStream: React.FC<VideoStreamProps> = ({ 
  stream, 
  isMuted = false, 
  isVideoOff = false 
}) => {
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
        muted={isMuted}
        className={`w-full h-full object-cover rounded-lg ${isVideoOff ? 'hidden' : ''}`}
      />
      {isVideoOff && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
          <CameraOff className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default VideoStream;