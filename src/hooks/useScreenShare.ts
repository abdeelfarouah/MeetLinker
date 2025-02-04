import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useScreenShare = () => {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanupScreenStream = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing && screenStream) {
        cleanupScreenStream(screenStream);
        setScreenStream(null);
        setIsScreenSharing(false);
      } else {
        console.log('Starting screen share');
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        console.log('Screen share stream obtained:', stream);

        // Handle screen share stop from browser UI
        stream.getVideoTracks()[0].onended = () => {
          console.log('Screen sharing stopped by user');
          cleanupScreenStream(stream);
          setScreenStream(null);
          setIsScreenSharing(false);
          toast({
            title: "Screen sharing ended",
            description: "Screen sharing has been stopped",
          });
        };

        setScreenStream(stream);
        setIsScreenSharing(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error starting screen share:', err);
      setError('Failed to start screen sharing');
      toast({
        title: "Error",
        description: "Failed to start screen sharing. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      cleanupScreenStream(screenStream);
    };
  }, [screenStream]);

  return {
    screenStream,
    isScreenSharing,
    error: error,
    toggleScreenShare
  };
};