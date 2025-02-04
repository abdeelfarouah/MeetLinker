import { toast } from 'sonner';

export const initSpeechRecognition = (
  setTranscript: React.Dispatch<React.SetStateAction<string>>,
  setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported');
    toast.error('Speech recognition is not supported in this browser');
    return null;
  }

  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'fr-FR';

  recognition.onstart = () => {
    console.log('Speech recognition started');
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

  return recognition;
};

export const handleRecognitionError = (recognition: any) => (event: any) => {
  console.error('Speech recognition error:', event.error);
  recognition.stop();
};

export const handleRecognitionEnd = (recognition: any) => () => {
  console.log('Speech recognition ended');
  try {
    recognition.start();
  } catch (error) {
    console.error('Error restarting speech recognition:', error);
  }
};