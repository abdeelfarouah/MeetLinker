import React, { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import ParticipantList from './ParticipantList';
import ChatBox from './ChatBox';
import VideoStream from './VideoStream';
import ScreenShare from './ScreenShare';
import Controls from './Controls';
import VoiceTranscription from './VoiceTranscription';
import { LogOut, AlertCircle } from 'lucide-react';

type User = {
  email: string;
  name: string;
};

type Participant = {
  id: string;
  name: string;
  image: string;
  status: 'online' | 'offline' | 'no-response';
};

type RoomProps = {
  roomCode: string;
  handleLogout: () => void;
  currentUser: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

// Fake participants data
const fakeParticipants: Participant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '2',
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    status: 'offline'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '4',
    name: 'David Kim',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    status: 'no-response'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    status: 'online'
  }
];

const Room: React.FC<RoomProps> = ({ roomCode, handleLogout, currentUser, theme, setTheme }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<{ id: number; text: string; read: boolean; }[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Initialize participants with current user as host
  useEffect(() => {
    if (currentUser) {
      const currentUserParticipant: Participant = {
        id: '0',
        name: `${currentUser.name} (Hôte)`,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        status: 'online'
      };
      setParticipants([currentUserParticipant, ...fakeParticipants]);

      // Simulate random status changes for fake participants
      const statusInterval = setInterval(() => {
        setParticipants(prevParticipants => 
          prevParticipants.map(participant => {
            if (participant.id === '0') return participant;
            if (Math.random() < 0.1) {
              const statuses: ('online' | 'offline' | 'no-response')[] = ['online', 'offline', 'no-response'];
              const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
              return { ...participant, status: newStatus };
            }
            return participant;
          })
        );
      }, 5000);

      return () => clearInterval(statusInterval);
    }
  }, [currentUser]);

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
        setMediaError('Veuillez autoriser l\'accès à votre caméra et microphone.');
        return false;
      }
      
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setUserMediaStream(audioStream);
        setIsVideoOff(true);
        setMediaError('Accès vidéo impossible. Audio uniquement.');
        return true;
      } catch (audioError) {
        setMediaError('Impossible d\'accéder au microphone. Vérifiez vos permissions.');
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
      setMediaError('Échec du partage d\'écran. Veuillez réessayer.');
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

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Room: {roomCode}</h1>
        <div className="flex items-center gap-4">
          <DarkModeToggle theme={theme} setTheme={setTheme} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Media Error Alert */}
      {mediaError && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertCircle className="w-5 h-5" />
          <span>{mediaError}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {screenShareStream && (
              <ScreenShare
                screenShareStream={screenShareStream}
                onEndScreenShare={handleEndScreenShare}
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
          <Controls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onScreenShare={handleScreenShare}
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <ParticipantList participants={participants} />
          <ChatBox messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
};

export default Room;
