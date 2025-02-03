import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import ChatLayout from '@/components/chat/ChatLayout';
import VideoStreamsDisplay from '@/components/chat/VideoStreamsDisplay';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import VideoControls from '@/components/chat/VideoControls';
import TranscriptionDisplay from '@/components/chat/TranscriptionDisplay';
import ParticipantsList from '@/components/chat/ParticipantsList';
import { faker } from '@faker-js/faker/locale/fr';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const [participants] = useState(() => 
    Array.from({ length: 5 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      status: faker.helpers.arrayElement(['online', 'offline', 'away'] as const)
    }))
  );

  const currentUser = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    status: 'online' as const
  };

  const startVideo = async () => {
    try {
      if (isVideoOn) {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
        setIsVideoOn(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } else {
        console.log('Requesting video stream...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log('Video stream obtained:', stream);
        setVideoStream(stream);
        setIsVideoOn(true);
        startSpeechRecognition(stream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Error accessing camera');
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
      } else {
        console.log('Requesting screen share...');
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

  const startSpeechRecognition = (stream: MediaStream) => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        console.log('Transcription:', transcript);
        setTranscription(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error');
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [videoStream, screenStream]);

  return (
    <ChatLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6 h-full">
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
              onToggleVideo={startVideo}
              onToggleScreenShare={startScreenShare}
            />
            {transcription && <TranscriptionDisplay transcript={transcription} />}
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="h-full">
            <ParticipantsList 
              participants={participants}
              currentUser={currentUser}
            />
            <div className="p-4 border-t">
              <MessageList messages={messages} currentUser={currentUser} />
              <MessageInput onSendMessage={(content) => {
                const newMessage = {
                  id: Date.now().toString(),
                  content,
                  sender: currentUser.name,
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, newMessage]);
              }} />
            </div>
          </Card>
        </div>
      </div>
    </ChatLayout>
  );
};

export default ChatRoom;