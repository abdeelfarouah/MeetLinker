
import React, { useState } from 'react';
import RoomHeader from './room/RoomHeader';
import MediaError from './room/MediaError';
import MediaContainer from './room/MediaContainer';
import Controls from './Controls';
import ParticipantList from './ParticipantList';
import { useMediaHandlers } from './room/useMediaHandlers';
import { useParticipants } from './room/useParticipants';

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
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4`}>
      <RoomHeader 
        roomCode={roomCode}
        handleLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />

      <MediaError error={mediaError} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <MediaContainer
            screenShareStream={screenShareStream}
            userMediaStream={userMediaStream}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onEndScreenShare={handleEndScreenShare}
          />
          <Controls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onScreenShare={handleScreenShare}
          />
        </div>
        <div className="lg:col-span-1">
          <ParticipantList participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default Room;
