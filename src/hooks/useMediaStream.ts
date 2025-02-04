import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useMediaStream = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const startVideo = async () => {
    try {
      if (isVideoOn) {
        console.log('Stopping video stream');
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
        setIsVideoOn(false);
      } else {
        console.log('Starting video stream');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log('Video stream obtained:', stream);
        setVideoStream(stream);
        setIsVideoOn(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Error accessing camera');
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        console.log('Stopping screen share');
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
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
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast.error('Error sharing screen');
    }
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream, screenStream]);

  return {
    videoStream,
    screenStream,
    isVideoOn,
    isScreenSharing,
    startVideo,
    startScreenShare
  };
};