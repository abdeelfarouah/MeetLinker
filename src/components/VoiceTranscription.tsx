import React, { useEffect, useState } from 'react';
import TranscriptionStatus from './transcription/TranscriptionStatus';
import TranscriptionDisplay from './transcription/TranscriptionDisplay';
import { setupSpeechRecognition, handleRecognitionError, handleRecognitionEnd } from '../utils/speechRecognition';

type VoiceTranscriptionProps = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VoiceTranscription: React.FC<VoiceTranscriptionProps> = ({ stream }) => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    const recognition = setupSpeechRecognition(setTranscript, setIsTranscribing);
    
    if (!recognition) return;

    recognition.addEventListener('error', handleRecognitionError(recognition));
    recognition.addEventListener('end', handleRecognitionEnd(recognition));

    try {
      recognition.start();
      console.log('Initial speech recognition started');
    } catch (error) {
      console.error('Error starting initial speech recognition:', error);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
          console.log('Speech recognition cleanup');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [stream]);

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <TranscriptionStatus isTranscribing={isTranscribing} />
      <TranscriptionDisplay 
        transcript={transcript}
        isTranscribing={isTranscribing}
      />
    </div>
  );
};

export default VoiceTranscription;