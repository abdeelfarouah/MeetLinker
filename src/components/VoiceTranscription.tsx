import React, { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';

type VoiceTranscriptionProps = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VoiceTranscription: React.FC<VoiceTranscriptionProps> = ({ stream, isMuted }) => {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (!stream || isMuted || !('webkitSpeechRecognition' in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsTranscribing(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsTranscribing(false);
    };

    recognition.onend = () => {
      setIsTranscribing(false);
      if (!isMuted) {
        recognition.start();
      }
    };

    if (!isMuted) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [stream, isMuted]);

  if (!stream || isMuted) return null;

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Mic className={`w-5 h-5 ${isTranscribing ? 'text-green-500' : 'text-gray-400'}`} />
        <h3 className="font-medium text-gray-700 dark:text-gray-300">Live Transcription</h3>
      </div>
      <div className="min-h-[60px] p-3 bg-gray-50 dark:bg-gray-700/50 rounded border dark:border-gray-600">
        {transcript ? (
          <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            {isTranscribing ? 'Listening...' : 'No speech detected'}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceTranscription;