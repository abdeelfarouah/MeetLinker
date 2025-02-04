import { useState, useEffect, useCallback } from 'react';
import { speechRecognitionService } from '@/services/speechRecognition';
import { toast } from 'sonner';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleTranscript = useCallback((newTranscript: string) => {
    setTranscript(prev => prev + ' ' + newTranscript);
  }, []);

  const handleError = useCallback((error: string) => {
    toast.error(`Speech recognition error: ${error}`);
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const success = speechRecognitionService.initialize(handleTranscript, handleError);
    if (success) {
      speechRecognitionService.start();
      setIsRecording(true);
    }
  }, [handleTranscript, handleError]);

  const stopRecording = useCallback(() => {
    speechRecognitionService.stop();
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      speechRecognitionService.cleanup();
    };
  }, []);

  return {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscript: () => setTranscript('')
  };
};