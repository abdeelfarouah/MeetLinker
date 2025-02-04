import { useEffect, useRef, useState } from "react";

interface VideoStreamProps {
  stream: MediaStream | null;
  isActive?: boolean;
  isMuted?: boolean;
  className?: string;
}

const VideoStream = ({ 
  stream, 
  isActive = true, 
  isMuted = false,
  className = "" 
}: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    console.log('VideoStream: Setting up stream', { stream, isActive });

    if (video && stream && isActive) {
      video.srcObject = stream;
      setLoaded(false);
      
      // Handle stream end
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.onended = () => {
          console.log('VideoStream: Track ended', track.kind);
          if (video.srcObject === stream) {
            video.srcObject = null;
            setLoaded(false);
          }
        };
      });
    }

    return () => {
      if (video) {
        console.log('VideoStream: Cleanup');
        video.srcObject = null;
        setLoaded(false);
      }
    };
  }, [stream, isActive]);

  if (!isActive || !stream) {
    console.log('VideoStream: Not active or no stream');
    return null;
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading...
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onLoadedData={() => {
          console.log('VideoStream: Video loaded');
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default VideoStream;