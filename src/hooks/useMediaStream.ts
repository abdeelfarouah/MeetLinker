import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useMediaStream = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup function for streams
  const cleanupStream = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startVideo = async () => {
    try {
      if (isVideoOn && videoStream) {
        cleanupStream(videoStream);
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
        
        toast({
          title: "Camera Started",
          description: "Your camera is now active",
        });
      }
    } catch (error) {
      console.error('Error accessing video:', error);
      setError('Failed to access camera');
      toast({
        title: "Camera Error",
        description: "Failed to access your camera",
        variant: "destructive",
      });
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing && screenStream) {
        cleanupStream(screenStream);
        setScreenStream(null);
        setIsScreenSharing(false);
      } else {
        console.log('Starting screen share');
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        console.log('Screen share stream obtained:', stream);
        setScreenStream(stream);
        setIsScreenSharing(true);

        // Handle screen share stop from browser UI
        stream.getVideoTracks()[0].onended = () => {
          console.log('Screen sharing stopped by user');
          cleanupStream(stream);
          setScreenStream(null);
          setIsScreenSharing(false);
          toast({
            title: "Screen Share Ended",
            description: "Screen sharing has been stopped",
          });
        };

        toast({
          title: "Screen Share Started",
          description: "Your screen is now being shared",
        });
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      setError('Failed to share screen');
      toast({
        title: "Screen Share Error",
        description: "Failed to share your screen",
        variant: "destructive",
      });
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupStream(videoStream);
      cleanupStream(screenStream);
    };
  }, [videoStream, screenStream]);

  return {
    videoStream,
    screenStream,
    isVideoOn,
    isScreenSharing,
    error,
    startVideo,
    startScreenShare
  };
};