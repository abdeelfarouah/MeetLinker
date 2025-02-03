import { Button } from "@/components/ui/button";
import { Video, Monitor, VideoOff, MonitorOff } from "lucide-react";

interface VideoControlsProps {
  isVideoOn: boolean;
  isScreenSharing: boolean;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
}

const VideoControls = ({
  isVideoOn,
  isScreenSharing,
  onToggleVideo,
  onToggleScreenShare,
}: VideoControlsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Button 
        onClick={onToggleVideo}
        variant={isVideoOn ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isVideoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        {isVideoOn ? "Stop Camera" : "Start Camera"}
      </Button>
      <Button 
        onClick={onToggleScreenShare}
        variant={isScreenSharing ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      </Button>
    </div>
  );
};

export default VideoControls;