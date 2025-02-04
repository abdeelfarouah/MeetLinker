import { Camera, Mic, AlertCircle } from "lucide-react";

interface DeviceStatusProps {
  isVideoWorking: boolean;
  isAudioWorking: boolean;
}

const DeviceStatus = ({ isVideoWorking, isAudioWorking }: DeviceStatusProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="flex items-center gap-2">
          {isVideoWorking ? (
            <Camera className="text-green-600" />
          ) : (
            <AlertCircle className="text-red-600" />
          )}
          Caméra
        </span>
        <span className={`px-3 py-1 rounded-full ${isVideoWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isVideoWorking ? 'Connectée' : 'Non connectée'}
        </span>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="flex items-center gap-2">
          {isAudioWorking ? (
            <Mic className="text-green-600" />
          ) : (
            <AlertCircle className="text-red-600" />
          )}
          Microphone
        </span>
        <span className={`px-3 py-1 rounded-full ${isAudioWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isAudioWorking ? 'Connecté' : 'Non connecté'}
        </span>
      </div>
    </div>
  );
};

export default DeviceStatus;