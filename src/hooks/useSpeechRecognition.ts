import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { formatFrenchText } from '../utils/frenchTextFormatting';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();

  const initRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser');
      return null;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsRecording(true);
      toast.success('Voice recording started');
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const formattedResult = formatFrenchText(result);
          currentTranscript += formattedResult;
          console.log('Final transcript:', formattedResult);
        } else {
          currentTranscript += result;
          console.log('Interim transcript:', result);
        }
      }
      
      if (currentTranscript) {
        setTranscript(prev => {
          const newTranscript = prev ? `${prev} ${currentTranscript}` : currentTranscript;
          console.log('Updated transcript:', newTranscript);
          return newTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      
      if (isRecording) {
        restartTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to restart speech recognition after error');
          try {
            recognition.start();
          } catch (error) {
            console.error('Failed to restart speech recognition:', error);
            setIsRecording(false);
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        console.log('Restarting speech recognition');
        try {
          recognition.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
          setIsRecording(false);
        }
      }
    };

    return recognition;
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && !recognitionRef.current) {
      recognitionRef.current = initRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          console.log('Initial speech recognition started');
        } catch (error) {
          console.error('Error starting initial speech recognition:', error);
          setIsRecording(false);
        }
      }
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
          console.log('Speech recognition cleanup');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [isRecording, initRecognition]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
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