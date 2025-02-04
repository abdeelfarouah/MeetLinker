import VideoStream from '@/components/VideoStream';

interface VideoPreviewProps {
  videoStream: MediaStream | null;
  isLoading: boolean;
}

const VideoPreview = ({ videoStream, isLoading }: VideoPreviewProps) => {
  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading camera...</p>
      </div>
    );
  }

  if (!videoStream) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No camera detected</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <VideoStream stream={videoStream} />
    </div>
  );
};

export default VideoPreview;