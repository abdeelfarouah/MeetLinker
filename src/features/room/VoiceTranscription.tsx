import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface VoiceTranscriptionProps {
  stream: MediaStream | null;
  isMuted: boolean;
}

const VoiceTranscription: React.FC<VoiceTranscriptionProps> = ({ stream, isMuted }) => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (!stream || isMuted || !('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not available or stream muted');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      console.log('Voice transcription started');
      setIsTranscribing(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => `${prev} ${finalTranscript}`.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Transcription error:', event.error);
      setIsTranscribing(false);
    };

    recognition.onend = () => {
      setIsTranscribing(false);
      if (!isMuted) {
        recognition.start();
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting transcription:', error);
    }

    return () => {
      recognition.stop();
    };
  }, [stream, isMuted]);

  if (!stream || isMuted) return null;

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Mic className={`w-5 h-5 ${isTranscribing ? 'text-green-500' : 'text-gray-400'}`} />
        <h3 className="font-medium">Live Transcription</h3>
      </div>
      <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
        {transcript || <span className="text-gray-400">Waiting for speech...</span>}
      </div>
    </div>
  );
};

export default VoiceTranscription;