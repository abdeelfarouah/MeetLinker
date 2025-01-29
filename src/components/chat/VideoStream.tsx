import { useRef, useEffect, useState } from "react";

interface VideoStreamProps {
  isActive: boolean;
  stream: MediaStream | null;
  className?: string;
}

const VideoStream = ({ isActive, stream, className = "" }: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (video && stream) {
      if (stream.getVideoTracks().length > 0) {
        video.srcObject = stream;
        setLoaded(false);
      }
    }

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  if (!isActive) return null;

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {!loaded && <div className="absolute inset-0 flex items-center justify-center text-white">Loading...</div>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onLoadedData={() => setLoaded(true)}
      />
    </div>
  );
};

export default VideoStream;
