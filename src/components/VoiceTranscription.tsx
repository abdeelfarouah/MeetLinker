import React, { useEffect, useState } from 'react';
import TranscriptionStatus from './transcription/TranscriptionStatus';
import TranscriptionDisplay from './transcription/TranscriptionDisplay';
import { initSpeechRecognition, handleRecognitionError, handleRecognitionEnd } from '../utils/speechRecognition';

type VoiceTranscriptionProps = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VoiceTranscription: React.FC<VoiceTranscriptionProps> = ({ stream, isMuted }) => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMuted) {
      setIsTranscribing(false);
      return;
    }

    const recognition = initSpeechRecognition(setTranscript, setIsTranscribing);
    
    if (!recognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    recognition.addEventListener('error', (event) => {
      console.error('Speech recognition error:', event);
      handleRecognitionError(recognition)(event);
      setError('An error occurred with speech recognition');
    });

    recognition.addEventListener('end', () => {
      console.log('Speech recognition ended');
      handleRecognitionEnd(recognition)();
      setIsTranscribing(false);
    });

    try {
      recognition.start();
      console.log('Speech recognition started');
      setError(null);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start speech recognition');
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
  }, [stream, isMuted]);

  return (
    <div 
      className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      role="region"
      aria-label="Voice transcription"
    >
      {error && (
        <div className="text-red-500 mb-2" role="alert">
          {error}
        </div>
      )}
      <TranscriptionStatus isTranscribing={isTranscribing} />
      <TranscriptionDisplay 
        transcript={transcript}
        isTranscribing={isTranscribing}
      />
    </div>
  );
};

export default VoiceTranscription;