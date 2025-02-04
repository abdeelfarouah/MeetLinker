import { useState } from 'react';
import { faker } from '@faker-js/faker/locale/fr';
import { Card } from "@/components/ui/card";
import VideoStreamsDisplay from '@/components/chat/VideoStreamsDisplay';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import VideoControls from '@/components/chat/VideoControls';
import TranscriptionDisplay from '@/components/chat/TranscriptionDisplay';
import ParticipantsList from '@/components/chat/ParticipantsList';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useMessages } from '@/hooks/useMessages';
import { decryptMessage } from '@/utils/crypto';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const ChatRoom = () => {
  const {
    videoStream,
    screenStream,
    isVideoOn,
    isScreenSharing,
    startVideo,
    startScreenShare
  } = useMediaStream();

  const currentUser = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    status: 'online' as const
  };

  const { messages, handleSendMessage } = useMessages(currentUser.name);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>('');

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
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
              <VideoControls
                isVideoOn={isVideoOn}
                isScreenSharing={isScreenSharing}
                isRecording={isRecording}
                onToggleVideo={startVideo}
                onToggleScreenShare={startScreenShare}
                onToggleRecording={handleToggleRecording}
              />
              {transcription && (
                <TranscriptionDisplay 
                  transcript={transcription} 
                  isRecording={isRecording} 
                />
              )}
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
                      messages={messages.map(msg => ({
                        ...msg,
                        content: decryptMessage(msg.content)
                      }))}
                      currentUser={currentUser}
                    />
                    <MessageInput 
                      onSendMessage={handleSendMessage} 
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

export default ChatRoom;