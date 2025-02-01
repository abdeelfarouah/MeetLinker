import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoStream from "@/components/chat/VideoStream";
import MediaControls from "@/components/chat/MediaControls";
import TranscriptionDisplay from "@/components/chat/TranscriptionDisplay";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  addEventListener: (type: string, listener: (event: SpeechRecognitionEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: SpeechRecognitionEvent) => void) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const ChatRoom = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; isActive: boolean }>>([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Speech Recognition Configuration
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "fr-FR";

      recognitionRef.current.addEventListener("result", (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(transcript);
      });

      recognitionRef.current.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [videoStream, screenStream]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
          {/* Left side - Video and Screen Share */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <Card className="h-full">
              <div className="h-full flex flex-col">
                <Tabs defaultValue="video" className="w-full flex-1">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="video">Video Chat</TabsTrigger>
                    <TabsTrigger value="screen">Screen Share</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="flex-1">
                    <div className="h-full p-4">
                      <VideoStream isActive={isVideoOn} stream={videoStream} className="h-full" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="screen" className="flex-1">
                    <div className="h-full p-4">
                      <VideoStream isActive={isScreenSharing} stream={screenStream} className="h-full" />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="p-4 border-t">
                  <MediaControls
                    isVideoOn={isVideoOn}
                    isScreenSharing={isScreenSharing}
                    onToggleVideo={startVideo}
                    onToggleScreenShare={startScreenShare}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right side - Chat and Transcription */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="h-[calc(70vh-1rem)]">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Chat Room</h2>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <MessageList messages={messages} />
                </ScrollArea>

                <div className="p-4 border-t">
                  <MessageInput onSendMessage={handleSendMessage} />
                </div>
              </div>
            </Card>

            <Card className="h-[calc(30vh-1rem)]">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Live Transcription</h2>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <TranscriptionDisplay transcript={transcript} />
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;