import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoControlsProps {
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
}

const VideoControls = ({
  isVideoOn,
  isScreenSharing,
  isRecording,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
}: VideoControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="icon"
            onClick={onToggleVideo}
          >
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="icon"
            onClick={onToggleScreenShare}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-4 w-4" />
            ) : (
              <MonitorUp className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isRecording ? "default" : "outline"}
            size="icon"
            onClick={onToggleRecording}
          >
            {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isRecording ? 'Stop recording' : 'Start recording'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default VideoControls;
