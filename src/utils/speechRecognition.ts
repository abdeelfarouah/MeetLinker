type RecognitionInstance = any; // Using any for webkitSpeechRecognition type

export const setupSpeechRecognition = (
  onTranscriptUpdate: (transcript: string) => void,
  onStatusChange: (isTranscribing: boolean) => void
) => {
  if (!('webkitSpeechRecognition' in window)) {
    console.log('Speech recognition not available');
    return null;
  }

  const recognition: RecognitionInstance = new (window as any).webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'fr-FR';

  recognition.onstart = () => {
    console.log('Speech recognition started');
    onStatusChange(true);
  };

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += result;
        console.log('Final transcript:', finalTranscript);
      } else {
        interimTranscript += result;
        console.log('Interim transcript:', interimTranscript);
      }
    }

    onTranscriptUpdate(prev => {
      const newTranscript = finalTranscript || interimTranscript;
      return newTranscript ? `${prev} ${newTranscript}`.trim() : prev;
    });
  };

  return recognition;
};

export const handleRecognitionError = (recognition: RecognitionInstance) => {
  return (event: any) => {
    console.error('Speech recognition error:', event.error);
    restartRecognition(recognition);
  };
};

export const handleRecognitionEnd = (recognition: RecognitionInstance) => {
  return () => {
    console.log('Speech recognition ended');
    restartRecognition(recognition);
  };
};

const restartRecognition = (recognition: RecognitionInstance) => {
  if (!recognition) return;
  
  setTimeout(() => {
    try {
      recognition.start();
      console.log('Speech recognition restarted');
    } catch (error) {
      console.error('Error restarting speech recognition:', error);
    }
  }, 100);
};