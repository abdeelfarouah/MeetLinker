import { useEffect, useRef } from 'react';

interface VideoStreamsDisplayProps {
  videoStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

const VideoStreamsDisplay = ({
  videoStream,
  screenStream,
  isVideoOn,
  isScreenSharing,
}: VideoStreamsDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  console.log('VideoStreamsDisplay props:', { isVideoOn, isScreenSharing });

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    if (screenRef.current && screenStream) {
      screenRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  if (!isVideoOn && !isScreenSharing) {
    return (
      <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No active streams</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {isVideoOn && (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Your Camera
          </div>
        </div>
      )}
      {isScreenSharing && (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={screenRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Screen Share
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoStreamsDisplay;