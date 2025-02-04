import React from 'react';
import VideoStream from '@/components/VideoStream';

interface VideoStreamsDisplayProps {
  videoStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

const VideoStreamsDisplay: React.FC<VideoStreamsDisplayProps> = ({
  videoStream,
  screenStream,
  isVideoOn,
  isScreenSharing
}) => {
  console.log('VideoStreamsDisplay props:', { videoStream, screenStream, isVideoOn, isScreenSharing });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isVideoOn && videoStream && (
        <div className="relative aspect-video">
          <VideoStream stream={videoStream} />
        </div>
      )}
      {isScreenSharing && screenStream && (
        <div className="relative aspect-video">
          <VideoStream stream={screenStream} />
        </div>
      )}
    </div>
  );
};

export default VideoStreamsDisplay;