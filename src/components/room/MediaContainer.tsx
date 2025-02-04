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

const MediaContainer = ({
  screenShareStream,
  userMediaStream,
  isMuted,
  isVideoOff,
  onEndScreenShare,
}: MediaContainerProps) => {
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
            isMuted={isMuted}
            isVideoOff={isVideoOff}
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