import { Button } from "@/components/ui/button";
import { RefreshCw, Video } from "lucide-react";

interface DeviceCheckActionsProps {
  onRetry: () => void;
  onJoin: () => void;
  isLoading: boolean;
  isDevicesWorking: boolean;
}

const DeviceCheckActions = ({
  onRetry,
  onJoin,
  isLoading,
  isDevicesWorking
}: DeviceCheckActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Réessayer
      </Button>
      
      <Button
        onClick={onJoin}
        disabled={!isDevicesWorking || isLoading}
        className="flex items-center gap-2"
      >
        <Video className="w-4 h-4" />
        Rejoindre la réunion
      </Button>
    </div>
  );
};

export default DeviceCheckActions;