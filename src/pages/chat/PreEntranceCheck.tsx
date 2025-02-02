import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import VideoStream from "@/components/chat/VideoStream";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Camera, Mic } from "lucide-react";

const MEDIA_TIMEOUT = 10000; // 10 seconds timeout

const PreEntranceCheck = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoWorking, setIsVideoWorking] = useState(false);
  const [isAudioWorking, setIsAudioWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const checkDeviceSupport = async () => {
    console.log("Checking device support...");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Votre navigateur ne supporte pas l'accès aux périphériques média");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);

      const hasVideo = devices.some(device => device.kind === 'videoinput');
      const hasAudio = devices.some(device => device.kind === 'audioinput');

      if (!hasVideo || !hasAudio) {
        throw new Error("Caméra ou microphone non détecté");
      }

      return true;
    } catch (error) {
      console.error("Error checking device support:", error);
      return false;
    }
  };

  const getMediaStream = async () => {
    const stream = await Promise.race([
      navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Délai d'attente dépassé pour l'accès aux périphériques")), MEDIA_TIMEOUT)
      )
    ]) as MediaStream;

    return stream;
  };

  const startDeviceCheck = async () => {
    console.log("Starting device check...");
    setIsLoading(true);
    setIsVideoWorking(false);
    setIsAudioWorking(false);

    try {
      const deviceSupported = await checkDeviceSupport();
      if (!deviceSupported) {
        throw new Error("Périphériques non supportés");
      }

      const stream = await getMediaStream();
      console.log("Media stream obtained:", stream);

      // Verify tracks are active
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (!videoTrack?.enabled || !audioTrack?.enabled) {
        throw new Error("Les périphériques ne sont pas actifs");
      }

      // Test video track settings
      const videoSettings = videoTrack.getSettings();
      console.log("Video track settings:", videoSettings);

      if (!videoSettings.width || !videoSettings.height) {
        throw new Error("La caméra n'a pas pu être initialisée correctement");
      }

      setVideoStream(stream);
      setIsVideoWorking(true);
      setIsAudioWorking(true);
      
      toast({
        title: "Périphériques connectés",
        description: "Votre caméra et votre microphone fonctionnent correctement.",
      });
    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      
      let errorMessage = "Erreur d'accès aux périphériques";
      if (error.name === "NotAllowedError") {
        errorMessage = "Veuillez autoriser l'accès à la caméra et au microphone";
      } else if (error.name === "NotFoundError") {
        errorMessage = "Caméra ou microphone non trouvé";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Impossible d'accéder aux périphériques. Ils sont peut-être utilisés par une autre application";
      } else if (error.name === "AbortError") {
        errorMessage = "L'initialisation des périphériques a pris trop de temps. Veuillez réessayer";
      }

      toast({
        title: "Erreur périphériques",
        description: errorMessage,
        variant: "destructive",
      });

      setIsVideoWorking(false);
      setIsAudioWorking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const joinMeeting = () => {
    if (isVideoWorking && isAudioWorking) {
      navigate(`/chat/${roomId}`);
    } else {
      toast({
        title: "Vérification requise",
        description: "Veuillez vérifier votre caméra et microphone avant de rejoindre.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    startDeviceCheck();
    return () => {
      if (videoStream) {
        console.log("Cleaning up media streams");
        videoStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.kind} stopped`);
        });
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Vérification des périphériques</h1>
          
          <div className="space-y-6">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <VideoStream isActive={true} stream={videoStream} />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-2">
                  {isVideoWorking ? (
                    <Camera className="text-green-600" />
                  ) : (
                    <AlertCircle className="text-red-600" />
                  )}
                  Caméra
                </span>
                <span className={`px-3 py-1 rounded-full ${isVideoWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isVideoWorking ? 'Connectée' : 'Non connectée'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-2">
                  {isAudioWorking ? (
                    <Mic className="text-green-600" />
                  ) : (
                    <AlertCircle className="text-red-600" />
                  )}
                  Microphone
                </span>
                <span className={`px-3 py-1 rounded-full ${isAudioWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAudioWorking ? 'Connecté' : 'Non connecté'}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={startDeviceCheck}
                disabled={isLoading}
                variant="outline"
              >
                Réessayer
              </Button>
              <Button 
                onClick={joinMeeting}
                disabled={!isVideoWorking || !isAudioWorking || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Rejoindre la réunion
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PreEntranceCheck;