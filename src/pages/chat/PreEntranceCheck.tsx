import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import DeviceStatus from "@/components/DeviceStatus";
import VideoPreview from "@/components/VideoPreview";
import DeviceCheckActions from "@/components/DeviceCheckActions";
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

  useEffect(() => {
    startDeviceCheck();
  }, [startDeviceCheck]);

  const handleJoinMeeting = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Vérification des périphériques
          </h1>
          
          <div className="space-y-6">
            <VideoPreview 
              videoStream={videoStream}
              isLoading={isLoading}
            />

            <DeviceStatus 
              isVideoWorking={isVideoWorking}
              isAudioWorking={isAudioWorking}
            />

            <DeviceCheckActions 
              onRetry={startDeviceCheck}
              onJoin={handleJoinMeeting}
              isLoading={isLoading}
              isDevicesWorking={isVideoWorking && isAudioWorking}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PreEntranceCheck;