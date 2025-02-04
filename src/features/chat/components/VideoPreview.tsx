import React from 'react';
import VideoStream from '@/components/VideoStream';

type VideoPreviewProps = {
  videoStream: MediaStream | null;
  isLoading: boolean;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoStream, isLoading }) => {
  return (
    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <VideoStream isActive={true} stream={videoStream} />
      )}
    </div>
  );
};

export default VideoPreview;