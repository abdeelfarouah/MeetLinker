import React from 'react';
import { Button } from "@/components/ui/button";

interface MediaControlsProps {
  isVideoOn: boolean;
  isScreenSharing: boolean;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
}

const MediaControls: React.FC<MediaControlsProps> = ({
  isVideoOn,
  isScreenSharing,
  onToggleVideo,
  onToggleScreenShare,
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onToggleVideo}>
        {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
      </Button>
      <Button onClick={onToggleScreenShare}>
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </Button>
    </div>
  );
};

export default MediaControls;
