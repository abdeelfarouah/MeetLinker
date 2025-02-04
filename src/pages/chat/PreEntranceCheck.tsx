import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import VideoStream from "@/components/VideoStream";
import DeviceStatus from "@/features/chat/components/DeviceStatus";
import { useDeviceCheck } from "@/features/chat/hooks/useDeviceCheck";

const PreEntranceCheck = () => {
  const {
    videoStream,
    isVideoWorking,
    isAudioWorking,
    isLoading,
    startDeviceCheck
  } = useDeviceCheck();
  
  const { roomId } = useParams();
  const navigate = useNavigate();

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

            <DeviceStatus 
              isVideoWorking={isVideoWorking}
              isAudioWorking={isAudioWorking}
            />

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