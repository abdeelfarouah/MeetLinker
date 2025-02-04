import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { formatFrenchText } from '../utils/frenchTextFormatting';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isCleaningUpRef = useRef(false);

  const initRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("La reconnaissance vocale n'est pas supportée par ce navigateur");
      return null;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Reconnaissance vocale démarrée');
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => {
          const formattedTranscript = formatFrenchText(finalTranscript);
          return prev ? `${prev} ${formattedTranscript}` : formattedTranscript;
        });
      } else if (interimTranscript) {
        setTranscript(prev => {
          const lastSentence = prev.split('.').pop() || '';
          return prev.replace(lastSentence, '') + interimTranscript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      if (event.error !== 'no-speech' && !isCleaningUpRef.current) {
        toast.error(`Erreur de reconnaissance vocale: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Reconnaissance vocale terminée');
      if (isRecording && !isCleaningUpRef.current) {
        console.log('Redémarrage de la reconnaissance vocale');
        try {
          recognition.start();
        } catch (error) {
          console.error('Erreur lors du redémarrage:', error);
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
        } catch (error) {
          console.error('Erreur au démarrage initial:', error);
          setIsRecording(false);
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        isCleaningUpRef.current = true;
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Erreur lors de l\'arrêt:', error);
        }
        recognitionRef.current = null;
        isCleaningUpRef.current = false;
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
        console.error('Erreur lors de l\'arrêt:', error);
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