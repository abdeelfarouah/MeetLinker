import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const MEDIA_TIMEOUT = 10000;

export const useDeviceCheck = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoWorking, setIsVideoWorking] = useState(false);
  const [isAudioWorking, setIsAudioWorking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

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
    if (hasInitialized) {
      console.log("Device check already initialized, skipping...");
      return;
    }

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

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (!videoTrack?.enabled || !audioTrack?.enabled) {
        throw new Error("Les périphériques ne sont pas actifs");
      }

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
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  };

  useEffect(() => {
    startDeviceCheck();
    
    return () => {
      if (videoStream) {
        console.log("Cleaning up video stream");
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    };
  }, []);

  return {
    videoStream,
    isVideoWorking,
    isAudioWorking,
    isLoading,
    startDeviceCheck
  };
};