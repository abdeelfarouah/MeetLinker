import VideoStream from '@/components/VideoStream';

interface VideoStreamsDisplayProps {
  videoStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

const VideoStreamsDisplay = ({
  videoStream,
  screenStream,
  isVideoOn,
  isScreenSharing,
}: VideoStreamsDisplayProps) => {
  console.log('VideoStreamsDisplay: Rendering', { isVideoOn, isScreenSharing });

  if (!isVideoOn && !isScreenSharing) {
    return (
      <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No active streams</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {isVideoOn && (
        <div className="relative">
          <VideoStream stream={videoStream} />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Your Camera
          </div>
        </div>
      )}
      {isScreenSharing && (
        <div className="relative">
          <VideoStream stream={screenStream} />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Screen Share
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoStreamsDisplay;