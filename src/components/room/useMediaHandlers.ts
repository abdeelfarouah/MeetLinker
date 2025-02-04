import { useState, useEffect } from 'react';

export const useMediaHandlers = () => {
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const initializeMediaStream = async () => {
    try {
      console.log('Initializing media stream...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      console.log('Media stream obtained:', stream);
      setUserMediaStream(stream);
      setMediaError(null);
      return true;
    } catch (error: any) {
      console.error('Failed to access media devices:', error);
      
      if (error.name === 'NotAllowedError') {
        setMediaError('Please allow access to your camera and microphone.');
        return false;
      }
      
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setUserMediaStream(audioStream);
        setIsVideoOff(true);
        setMediaError('Video access not available. Audio only.');
        return true;
      } catch (audioError) {
        setMediaError('Unable to access microphone. Check your permissions.');
        return false;
      }
    }
  };

  const handleScreenShare = async () => {
    try {
      console.log('Starting screen share');
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        console.log('Screen share stream obtained:', stream);
        setScreenShareStream(stream);
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      setMediaError('Screen sharing failed. Please try again.');
    }
  };

  const toggleMute = () => {
    if (userMediaStream) {
      const audioTracks = userMediaStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (userMediaStream) {
      const videoTracks = userMediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        initializeMediaStream();
      } else {
        videoTracks.forEach(track => {
          track.enabled = isVideoOff;
        });
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const handleEndScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
    }
  };

  useEffect(() => {
    const setupMedia = async () => {
      await initializeMediaStream();
    };

    setupMedia();

    return () => {
      if (userMediaStream) {
        userMediaStream.getTracks().forEach(track => track.stop());
      }
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    userMediaStream,
    screenShareStream,
    mediaError,
    isMuted,
    isVideoOff,
    handleScreenShare,
    toggleMute,
    toggleVideo,
    handleEndScreenShare
  };
};