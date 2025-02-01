import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import VideoStream from "@/components/chat/VideoStream";
import MediaControls from "@/components/chat/MediaControls";
import TranscriptionDisplay from "@/components/chat/TranscriptionDisplay";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import ChatLayout from "@/components/chat/ChatLayout";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const ChatRoom = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; isActive: boolean }>>([
    { id: '1', text: 'Welcome to the chat room! You are now connected.', sender: 'system', isActive: true }
  ]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + " " + finalTranscript);
        }
      };

      recognition.start();
      return recognition;
    }
    return null;
  };

  const startVideo = async () => {
    try {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        setIsVideoOn(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setVideoStream(stream);
        setIsVideoOn(true);

        const recognition = startSpeechRecognition();
        if (!recognition) {
          toast({
            title: "Attention",
            description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
    }
  };

  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        setScreenStream(stream);
        setIsScreenSharing(true);

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      }
    } catch (error) {
      console.error("Erreur lors du partage d'écran:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager l'écran",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: message, sender: "user", isActive: true },
    ]);
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [videoStream, screenStream]); // ❌ Removed extra closing bracket

  return (
    <ChatLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Video Chat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-8rem)]">
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
        </div>

        <div className="space-y-4 h-full">
          <Card className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Chat</h2>
            <div className="flex-1 overflow-hidden">
              <MessageList messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </Card>
        </div>

        {transcript && (
          <div className="lg:col-span-3">
            <TranscriptionDisplay transcript={transcript} />
          </div>
        )}
      </div>
    </ChatLayout>
  );
};

export default ChatRoom;
