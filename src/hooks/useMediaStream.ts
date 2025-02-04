import { useVideoStream } from './useVideoStream';
import { useScreenShare } from './useScreenShare';

export const useMediaStream = () => {
  const { 
    videoStream, 
    isVideoOn, 
    error: videoError, 
    toggleVideo 
  } = useVideoStream();

  const { 
    screenStream, 
    isScreenSharing, 
    error: screenError, 
    toggleScreenShare 
  } = useScreenShare();

  return {
    videoStream,
    screenStream,
    isVideoOn,
    isScreenSharing,
    error: videoError || screenError,
    startVideo: toggleVideo,
    startScreenShare: toggleScreenShare
  };
};