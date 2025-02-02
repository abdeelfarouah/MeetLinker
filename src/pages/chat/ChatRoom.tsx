import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ChatLayout from '@/components/chat/ChatLayout';
import VideoStream from '@/components/chat/VideoStream';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import MediaControls from '@/components/chat/MediaControls';
import TranscriptionDisplay from '@/components/chat/TranscriptionDisplay';

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

  const startVideo = async () => {
    try {
      if (isVideoOn) {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        setIsVideoOn(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setVideoStream(stream);
        setIsVideoOn(true);
        startSpeechRecognition(stream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
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
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenStream(stream);
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const startSpeechRecognition = (stream: MediaStream) => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'You',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Video Chat</h2>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-8rem)]">
              <VideoStream isActive={isVideoOn} stream={videoStream} />
              <VideoStream isActive={isScreenSharing} stream={screenStream} />
            </div>
            <MediaControls
              isVideoOn={isVideoOn}
              isScreenSharing={isScreenSharing}
              onToggleVideo={startVideo}
              onToggleScreenShare={startScreenShare}
            />
          </Card>
          <TranscriptionDisplay text={transcription} />
        </div>
        <div className="space-y-4">
          <Card className="h-full flex flex-col">
            <MessageList messages={messages} />
            <MessageInput onSendMessage={sendMessage} />
          </Card>
        </div>
      </div>
    </ChatLayout>
  );
};

export default ChatRoom;