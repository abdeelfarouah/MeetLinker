import { useRef, useEffect } from "react";

interface VideoStreamProps {
  isActive: boolean;
  stream: MediaStream | null;
  className?: string;
}

const VideoStream = ({ isActive, stream, className = "" }: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isActive) return null;

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    </div>
  );
};

export default VideoStream;