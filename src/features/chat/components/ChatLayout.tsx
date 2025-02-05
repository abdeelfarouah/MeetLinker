import React from 'react';
import { Card } from "@/components/ui/card";
import VideoStreamsDisplay from '@/features/chat/components/VideoStreamsDisplay';
import MessageList from '@/features/chat/components/MessageList';
import MessageInput from '@/features/chat/components/MessageInput';
import VideoControls from '@/features/chat/components/VideoControls';
import TranscriptionDisplay from '@/features/chat/components/TranscriptionDisplay';
import ParticipantsList from '@/features/chat/components/ParticipantsList';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useMessages } from '@/hooks/useMessages';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { faker } from '@faker-js/faker/locale/fr';

const ChatLayout = () => {
  const {
    videoStream,
    screenStream,
    isVideoOn,
    isScreenSharing,
    startVideo,
    startScreenShare
  } = useMediaStream();

  const {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscript
  } = useSpeechRecognition();

  // Generate user data with a consistent avatar
  const userId = faker.string.uuid();
  const avatarUrl = faker.image.avatar();
  const currentUser = {
    id: userId,
    name: faker.person.fullName(),
    avatar: avatarUrl,
    image: avatarUrl,
    status: 'online' as const
  };

  const { messages, handleSendMessage } = useMessages(currentUser.name, currentUser.id, currentUser.avatar);

  // Use the new WebSocket hook
  const { isConnected, sendMessage } = useWebSocketConnection({
    url: `wss://${window.location.hostname}`,
    onMessage: (event) => {
      console.log('Message received:', event.data);
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      clearTranscript();
    } else {
      startRecording();
    }
  };

  const handleMessageSubmit = (content: string) => {
    handleSendMessage(content);
    if (isConnected) {
      sendMessage({
        type: 'chat_message',
        content,
        userId,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 shadow-none bg-background">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <VideoStreamsDisplay
                videoStream={videoStream}
                screenStream={screenStream}
                isVideoOn={isVideoOn}
                isScreenSharing={isScreenSharing}
              />
              
              <TranscriptionDisplay 
                transcript={transcript}
                isRecording={isRecording}
              />

              <VideoControls
                isVideoOn={isVideoOn}
                isScreenSharing={isScreenSharing}
                isRecording={isRecording}
                onToggleVideo={startVideo}
                onToggleScreenShare={startScreenShare}
                onToggleRecording={handleToggleRecording}
              />
            </div>
            
            <ErrorBoundary>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <ParticipantsList 
                    participants={[currentUser]} 
                    currentUser={currentUser}
                  />
                </div>
                <div className="md:col-span-3">
                  <Card className="p-4 shadow-sm bg-card">
                    <MessageList 
                      messages={messages}
                      currentUserId={currentUser.id}
                    />
                    <MessageInput 
                      onSendMessage={handleMessageSubmit}
                    />
                  </Card>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatLayout;