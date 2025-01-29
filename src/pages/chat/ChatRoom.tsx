import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const ChatRoom = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string }>>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  
  // Configuration de la reconnaissance vocale
  const startSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };
      
      recognition.start();
      return recognition;
    }
    return null;
  };

  // Gestion de la vidéo
  const startVideo = async () => {
    try {
      if (isVideoOn) {
        // Arrêter la vidéo
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        setIsVideoOn(false);
      } else {
        // Démarrer la vidéo
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsVideoOn(true);
          
          // Démarrer la reconnaissance vocale
          const recognition = startSpeechRecognition();
          if (!recognition) {
            toast({
              title: "Attention",
              description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
              variant: "destructive",
            });
          }
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

  // Gestion du partage d'écran
  const startScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Arrêter le partage d'écran
        if (screenVideoRef.current?.srcObject) {
          const tracks = (screenVideoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          screenVideoRef.current.srcObject = null;
        }
        setIsScreenSharing(false);
      } else {
        // Démarrer le partage d'écran
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true
        });
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
          setIsScreenSharing(true);
        }
        
        // Arrêter le partage d'écran quand l'utilisateur arrête le partage
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = null;
          }
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: message, sender: "user" }]);
      setMessage("");
    }
  };

  // Nettoyage des flux médias à la fermeture
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (screenVideoRef.current?.srcObject) {
        const tracks = (screenVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">Salon de discussion</h1>
        <div className="flex gap-2 mt-2">
          <Button 
            onClick={startVideo}
            variant={isVideoOn ? "destructive" : "default"}
          >
            {isVideoOn ? "Arrêter la vidéo" : "Démarrer la vidéo"}
          </Button>
          <Button 
            onClick={startScreenShare}
            variant={isScreenSharing ? "destructive" : "default"}
          >
            {isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 gap-4 p-4">
        <div className="flex w-3/4 flex-col">
          {/* Zone de vidéo et partage d'écran */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {isVideoOn && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            {isScreenSharing && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Zone de transcription */}
          {transcript && (
            <Card className="p-4 mb-4 max-h-40 overflow-y-auto">
              <h3 className="font-semibold mb-2">Transcription en direct</h3>
              <p className="text-sm">{transcript}</p>
            </Card>
          )}

          {/* Zone de chat */}
          <Card className="flex-1">
            <ScrollArea className="h-[calc(100vh-28rem)] p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
            />
            <Button type="submit">Envoyer</Button>
          </form>
        </div>
        
        <Card className="w-1/4 p-4">
          <h2 className="mb-4 font-semibold">Participants</h2>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Aucun participant</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatRoom;