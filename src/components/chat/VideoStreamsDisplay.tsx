import VideoStream from "./VideoStream";

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
  if (!isVideoOn && !isScreenSharing) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-12rem)]">
      {isVideoOn && (
        <div className="relative">
          <VideoStream isActive={isVideoOn} stream={videoStream} className="rounded-lg" />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Your Camera
          </div>
        </div>
      )}
      {isScreenSharing && (
        <div className="relative">
          <VideoStream isActive={isScreenSharing} stream={screenStream} className="rounded-lg" />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Screen Share
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoStreamsDisplay;