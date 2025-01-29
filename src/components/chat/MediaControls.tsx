import { Button } from "@/components/ui/button";

interface MediaControlsProps {
  isVideoOn: boolean;
  isScreenSharing: boolean;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
}

const MediaControls = ({
  isVideoOn,
  isScreenSharing,
  onToggleVideo,
  onToggleScreenShare,
}: MediaControlsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <Button 
        onClick={onToggleVideo}
        variant={isVideoOn ? "destructive" : "default"}
      >
        {isVideoOn ? "Arrêter la vidéo" : "Démarrer la vidéo"}
      </Button>
      <Button 
        onClick={onToggleScreenShare}
        variant={isScreenSharing ? "destructive" : "default"}
      >
        {isScreenSharing ? "Arrêter le partage" : "Partager l'écran"}
      </Button>
    </div>
  );
};

export default MediaControls;