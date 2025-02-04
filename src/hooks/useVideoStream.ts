import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useVideoStream = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanupVideoStream = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = async () => {
    try {
      if (isVideoOn && videoStream) {
        cleanupVideoStream(videoStream);
        setVideoStream(null);
        setIsVideoOn(false);
      } else {
        console.log('Starting video stream');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });
        console.log('Video stream obtained:', stream);
        setVideoStream(stream);
        setIsVideoOn(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing video stream:', err);
      setError('Failed to access camera');
      toast({
        title: "Error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      cleanupVideoStream(videoStream);
    };
  }, [videoStream]);

  return {
    videoStream,
    isVideoOn,
    error: error,
    toggleVideo
  };
};