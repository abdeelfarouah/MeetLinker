import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import VideoStream from "@/components/chat/VideoStream";

const PreEntranceCheck = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoWorking, setIsVideoWorking] = useState(false);
  const [isAudioWorking, setIsAudioWorking] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const startDeviceCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);
      setIsVideoWorking(true);
      setIsAudioWorking(true);
      
      toast({
        title: "Devices connected",
        description: "Your camera and microphone are working properly.",
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Device Error",
        description: "Unable to access camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const joinMeeting = () => {
    if (isVideoWorking && isAudioWorking) {
      navigate(`/chat/${roomId}`);
    } else {
      toast({
        title: "Device Check Required",
        description: "Please check your camera and microphone before joining.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    startDeviceCheck();
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Device Check</h1>
          
          <div className="space-y-6">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <VideoStream isActive={true} stream={videoStream} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>Camera</span>
                <span className={`px-3 py-1 rounded-full ${isVideoWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isVideoWorking ? 'Working' : 'Not Connected'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>Microphone</span>
                <span className={`px-3 py-1 rounded-full ${isAudioWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAudioWorking ? 'Working' : 'Not Connected'}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={startDeviceCheck}>
                Retry Device Check
              </Button>
              <Button 
                onClick={joinMeeting}
                disabled={!isVideoWorking || !isAudioWorking}
                className="bg-green-600 hover:bg-green-700"
              >
                Join Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreEntranceCheck;