import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'fr-FR'; // Set to French, but you can change this

    recognitionInstance.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      console.log('Speech recognition result:', currentTranscript); // Debug log
      setTranscript(prev => prev + ' ' + currentTranscript);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        recognitionInstance.start();
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
        console.log('Speech recognition started');
        toast.success('Voice recording started');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start voice recording');
      }
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      console.log('Speech recognition stopped');
      toast.success('Voice recording stopped');
    }
  }, [recognition]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isRecording,
    startRecording,
    stopRecording,
    clearTranscript
  };
};