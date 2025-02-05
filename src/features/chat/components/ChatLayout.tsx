import React, { useEffect, useRef } from 'react';
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
import { Message, SupabaseMessage } from '@/types/chat';

interface ChatLayoutProps {
  roomId: string;
  userId: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ roomId, userId }) => {
  const layoutRef = useRef<HTMLDivElement>(null);
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
  const avatarUrl = faker.image.avatar();
  const currentUser = {
    id: userId,
    name: faker.person.fullName(),
    avatar: avatarUrl,
    image: avatarUrl,
    status: 'online' as const
  };

  const { messages: supabaseMessages, isLoading, sendMessage } = useMessages(roomId, userId);

  // Transform Supabase messages to the Message type
  const transformedMessages: Message[] = (supabaseMessages || []).map((msg: SupabaseMessage) => ({
    id: msg.id,
    content: msg.content,
    sender: {
      id: msg.user_id,
      name: msg.profiles?.username || 'Unknown User',
      avatar: msg.profiles?.avatar_url || avatarUrl,
    },
    timestamp: new Date(msg.created_at),
  }));

  // Use the WebSocket hook with debounced resize handling
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocketConnection({
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
    sendMessage(content);
    if (isConnected) {
      sendWebSocketMessage({
        type: 'chat_message',
        content,
        userId,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Use ResizeObserver with debouncing
  useEffect(() => {
    if (!layoutRef.current) return;

    let timeoutId: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce resize operations
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          if (entry.target === layoutRef.current) {
            // Handle resize if needed
            console.log('Layout resized');
          }
        }
      }, 100); // 100ms debounce
    });

    resizeObserver.observe(layoutRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={layoutRef} className="min-h-screen bg-background p-4 space-y-4">
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
                      messages={transformedMessages}
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