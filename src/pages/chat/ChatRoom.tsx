import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import VideoStreamsDisplay from '@/components/chat/VideoStreamsDisplay';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import VideoControls from '@/components/chat/VideoControls';
import TranscriptionDisplay from '@/components/chat/TranscriptionDisplay';
import ParticipantsList from '@/components/chat/ParticipantsList';
import { faker } from '@faker-js/faker/locale/fr';
import { toast } from 'sonner';
import { encryptMessage, decryptMessage } from '@/utils/crypto';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { Message } from '@/types/chat';

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  
  console.log('Rendering ChatRoom with streams:', { videoStream, screenStream });
  
  // Generate current user
  const currentUser = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    status: 'online' as const
  };

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

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Video Chat</h2>
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
            {transcription && <TranscriptionDisplay transcript={transcription} isRecording={isRecording} />}
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="h-full">
            <ErrorBoundary>
              <ParticipantsList 
                participants={[currentUser]} 
                currentUser={currentUser}
              />
              <div className="p-4 border-t">
                <MessageList 
                  messages={messages.map(msg => ({
                    ...msg,
                    content: decryptMessage(msg.content)
                  }))}
                  currentUser={currentUser}
                />
                <MessageInput onSendMessage={(content) => {
                  const encryptedContent = encryptMessage(content);
                  const newMessage = {
                    id: Date.now().toString(),
                    content: encryptedContent,
                    sender: currentUser.name,
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, newMessage]);
                }} />
              </div>
            </ErrorBoundary>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;