import React from 'react';
import VideoStream from '@/features/video/components/VideoStream';
import ScreenShare from '../ScreenShare';
import VoiceTranscription from '../VoiceTranscription';

interface MediaContainerProps {
  screenShareStream: MediaStream | null;
  userMediaStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  onEndScreenShare: () => void;
}

const MediaContainer: React.FC<MediaContainerProps> = ({
  screenShareStream,
  userMediaStream,
  isMuted,
  isVideoOff,
  onEndScreenShare,
}) => {
  console.log('MediaContainer: Rendering', { 
    hasScreenShare: !!screenShareStream, 
    hasUserMedia: !!userMediaStream,
    isMuted,
    isVideoOff 
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {screenShareStream && (
        <ScreenShare
          screenShareStream={screenShareStream}
          onEndScreenShare={onEndScreenShare}
        />
      )}
      {userMediaStream && (
        <>
          <VideoStream
            stream={userMediaStream}
            isActive={!isVideoOff}
            isMuted={isMuted}
          />
          <VoiceTranscription
            stream={userMediaStream}
            isMuted={isMuted}
          />
        </>
      )}
    </div>
  );
};

export default MediaContainer;