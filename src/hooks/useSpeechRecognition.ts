import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { formatFrenchText } from '../utils/frenchTextFormatting';

type SupportedLanguage = 'fr-FR' | 'en-US' | 'es-ES' | 'de-DE' | 'it-IT' | 'pt-PT' | 'nl-NL' | 'pl-PL' | 'ru-RU' | 'zh-CN' | 'ja-JP' | 'ko-KR' | 'ar-SA' | 'hi-IN';

const languageNames: Record<SupportedLanguage, string> = {
  'fr-FR': 'Français',
  'en-US': 'English',
  'es-ES': 'Español',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'pt-PT': 'Português',
  'nl-NL': 'Nederlands',
  'pl-PL': 'Polski',
  'ru-RU': 'Русский',
  'zh-CN': '中文',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'ar-SA': 'العربية',
  'hi-IN': 'हिन्दी'
};

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr-FR');
  const recognitionRef = useRef<any>(null);
  const isCleaningUpRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout>();
  const continuousTranscriptRef = useRef('');

  const initRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("La reconnaissance vocale n'est pas supportée par ce navigateur");
      return null;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log(`Reconnaissance vocale démarrée en ${languageNames[currentLanguage]}`);
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          continuousTranscriptRef.current += ' ' + transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(continuousTranscriptRef.current.trim());
      } else if (interimTranscript) {
        setTranscript(continuousTranscriptRef.current + ' ' + interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      if (event.error !== 'no-speech' && !isCleaningUpRef.current) {
        restartRecognition();
      }
    };

    recognition.onend = () => {
      console.log('Session de reconnaissance terminée, redémarrage...');
      if (!isCleaningUpRef.current) {
        restartRecognition();
      }
    };

    return recognition;
  }, [currentLanguage]);

  const restartRecognition = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Erreur lors de l\'arrêt:', error);
        }
      }

      recognitionRef.current = initRecognition();
      if (recognitionRef.current && isRecording) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Erreur lors du redémarrage:', error);
        }
      }
    }, 300);
  }, [initRecognition, isRecording]);

  useEffect(() => {
    if (isRecording && !recognitionRef.current) {
      recognitionRef.current = initRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Erreur au démarrage initial:', error);
          restartRecognition();
        }
      }
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
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
  }, [isRecording, initRecognition, restartRecognition]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    continuousTranscriptRef.current = '';
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

  const changeLanguage = useCallback((newLanguage: SupportedLanguage) => {
    setCurrentLanguage(newLanguage);
    if (recognitionRef.current) {
      restartRecognition();
    }
  }, [restartRecognition]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    continuousTranscriptRef.current = '';
  }, []);

  return {
    transcript,
    isRecording,
    currentLanguage,
    availableLanguages: languageNames,
    startRecording,
    stopRecording,
    changeLanguage,
    clearTranscript
  };
};