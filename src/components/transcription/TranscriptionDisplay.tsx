import React from 'react';

interface TranscriptionDisplayProps {
  transcript: string;
  isTranscribing: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcript, isTranscribing }) => {
  return (
    <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-700/50 rounded border dark:border-gray-600">
      {transcript ? (
        <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic">
          {isTranscribing ? 'Écoute en cours...' : 'Aucune parole détectée'}
        </p>
      )}
    </div>
  );
};

export default TranscriptionDisplay;