import VideoStream from '../VideoStream';
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
  onEndScreenShare
}) => {
  return (
    <div className="space-y-4">
      {screenShareStream ? (
        <ScreenShare 
          stream={screenShareStream} 
          onEndShare={onEndScreenShare} 
        />
      ) : (
        <VideoStream 
          stream={userMediaStream}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
        />
      )}
      <VoiceTranscription 
        stream={userMediaStream} 
        isMuted={isMuted} 
      />
    </div>
  );
};

export default MediaContainer;