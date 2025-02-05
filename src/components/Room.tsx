
import React from 'react';
import RoomHeader from './room/RoomHeader';
import MediaError from './room/MediaError';
import MediaContainer from './room/MediaContainer';
import Controls from './Controls';
import ParticipantList from './ParticipantList';
import { useMediaHandlers } from './room/useMediaHandlers';
import { useParticipants } from './room/useParticipants';
import { useIsMobile } from '@/hooks/use-mobile';

type User = {
  email: string;
  name: string;
};

type RoomProps = {
  roomCode: string;
  handleLogout: () => void;
  currentUser: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const Room: React.FC<RoomProps> = ({ roomCode, handleLogout, currentUser, theme, setTheme }) => {
  const isMobile = useIsMobile();
  
  const {
    userMediaStream,
    screenShareStream,
    mediaError,
    isMuted,
    isVideoOff,
    handleScreenShare,
    toggleMute,
    toggleVideo,
    handleEndScreenShare
  } = useMediaHandlers();

  const { participants } = useParticipants(currentUser);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <RoomHeader 
        roomCode={roomCode}
        handleLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      <MediaError error={mediaError} />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <MediaContainer
              screenShareStream={screenShareStream}
              userMediaStream={userMediaStream}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              onEndScreenShare={handleEndScreenShare}
            />
          </div>
          <Controls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onScreenShare={handleScreenShare}
          />
        </div>
        
        <div className={`${isMobile ? 'h-48' : 'w-80'} flex-shrink-0 overflow-y-auto`}>
          <ParticipantList participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default Room;

