import React, { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';

type VoiceTranscriptionProps = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VoiceTranscription: React.FC<VoiceTranscriptionProps> = ({ stream, isMuted }) => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (!stream || !('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not available or no stream');
      return;
    }

    console.log('Initializing speech recognition...');
    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'fr-FR';

    recognitionInstance.addEventListener('start', () => {
      console.log('Speech recognition started');
      setIsTranscribing(true);
    });

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          console.log('Final transcript:', finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
          console.log('Interim transcript:', interimTranscript);
        }
      }

      setTranscript(prev => {
        const newTranscript = finalTranscript || interimTranscript;
        return newTranscript ? `${prev} ${newTranscript}`.trim() : prev;
      });
    };

    recognitionInstance.addEventListener('error', (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsTranscribing(false);
      
      // Restart recognition after error if not muted
      if (!isMuted) {
        setTimeout(() => {
          try {
            recognitionInstance.start();
          } catch (error) {
            console.error('Error restarting after error:', error);
          }
        }, 1000);
      }
    });

    recognitionInstance.addEventListener('end', () => {
      console.log('Speech recognition ended, attempting restart...');
      setIsTranscribing(false);
      
      // Only restart if not muted and recognition is still needed
      if (!isMuted) {
        setTimeout(() => {
          try {
            recognitionInstance.start();
            console.log('Speech recognition restarted successfully');
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
          }
        }, 100);
      }
    });

    setRecognition(recognitionInstance);

    // Start recognition if not muted
    if (!isMuted) {
      try {
        recognitionInstance.start();
        console.log('Initial speech recognition started');
      } catch (error) {
        console.error('Error starting initial speech recognition:', error);
      }
    }

    return () => {
      try {
        recognitionInstance.stop();
        console.log('Speech recognition cleanup');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    };
  }, [stream, isMuted]);

  if (!stream || isMuted) return null;

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Mic className={`w-5 h-5 ${isTranscribing ? 'text-green-500' : 'text-gray-400'}`} />
        <h3 className="font-medium text-gray-700 dark:text-gray-300">Transcription en direct</h3>
      </div>
      <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-700/50 rounded border dark:border-gray-600">
        {transcript ? (
          <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            {isTranscribing ? 'Écoute en cours...' : 'Aucune parole détectée'}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceTranscription;