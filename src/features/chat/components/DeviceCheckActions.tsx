import React from 'react';
import { Button } from '@/components/ui/button';

type DeviceCheckActionsProps = {
  onRetry: () => void;
  onJoin: () => void;
  isLoading: boolean;
  isDevicesWorking: boolean;
};

const DeviceCheckActions: React.FC<DeviceCheckActionsProps> = ({
  onRetry,
  onJoin,
  isLoading,
  isDevicesWorking,
}) => {
  return (
    <div className="flex justify-center gap-4">
      <Button 
        onClick={onRetry}
        disabled={isLoading}
        variant="outline"
      >
        Réessayer
      </Button>
      <Button 
        onClick={onJoin}
        disabled={!isDevicesWorking || isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        Rejoindre la réunion
      </Button>
    </div>
  );
};

export default DeviceCheckActions;