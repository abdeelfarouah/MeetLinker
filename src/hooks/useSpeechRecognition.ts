import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { formatFrenchText } from '../utils/frenchTextFormatting';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'fr-FR';

    recognitionInstance.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          const formattedResult = formatFrenchText(result);
          currentTranscript += formattedResult;
          console.log('Speech recognition result:', formattedResult);
        }
      }
      
      if (currentTranscript) {
        setTranscript(prev => {
          const spacing = prev ? ' ' : '';
          return prev + spacing + currentTranscript;
        });
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
      
      // Attempt to restart after error
      if (isRecording) {
        restartTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to restart speech recognition after error');
          try {
            recognitionInstance.start();
          } catch (error) {
            console.error('Failed to restart speech recognition:', error);
          }
        }, 1000);
      }
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        console.log('Restarting speech recognition');
        try {
          recognitionInstance.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
        }
      }
    };

    recognitionRef.current = recognitionInstance;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        console.log('Speech recognition started');
        toast.success('Voice recording started');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start voice recording');
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
        console.log('Speech recognition stopped');
        toast.success('Voice recording stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, []);

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