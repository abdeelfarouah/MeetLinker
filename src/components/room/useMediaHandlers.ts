import { useState, useCallback } from 'react';

export const useMediaHandlers = () => {
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenShareStream(stream);
      setMediaError(null);
    } catch (error) {
      setMediaError('Failed to start screen sharing');
      console.error('Screen share error:', error);
    }
  }, []);

  const handleEndScreenShare = useCallback(() => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
    }
  }, [screenShareStream]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    setIsVideoOff(prev => !prev);
  }, []);

  return {
    userMediaStream,
    screenShareStream,
    mediaError,
    isMuted,
    isVideoOff,
    handleScreenShare,
    handleEndScreenShare,
    toggleMute,
    toggleVideo
  };
};