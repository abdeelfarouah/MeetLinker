import React from 'react';
import { Mic } from 'lucide-react';

interface TranscriptionStatusProps {
  isTranscribing: boolean;
}

const TranscriptionStatus: React.FC<TranscriptionStatusProps> = ({ isTranscribing }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Mic className={`w-5 h-5 ${isTranscribing ? 'text-green-500' : 'text-gray-400'}`} />
      <h3 className="font-medium text-gray-700 dark:text-gray-300">Transcription en direct</h3>
    </div>
  );
};

export default TranscriptionStatus;