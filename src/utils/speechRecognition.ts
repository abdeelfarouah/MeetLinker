type SpeechRecognitionCallback = (transcript: string) => void;

export const initSpeechRecognition = (
  setTranscript: React.Dispatch<React.SetStateAction<string>>,
  setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>,
  onTranscriptUpdate?: SpeechRecognitionCallback
) => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported');
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
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript || interimTranscript) {
      setTranscript(prev => {
        const newText = finalTranscript || interimTranscript;
        return prev ? `${prev} ${newText}` : newText;
      });
      
      if (onTranscriptUpdate) {
        onTranscriptUpdate(finalTranscript || interimTranscript);
      }
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsTranscribing(false);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    // Automatically restart recognition if it ends
    try {
      recognition.start();
      console.log('Restarting speech recognition');
    } catch (error) {
      console.error('Error restarting speech recognition:', error);
      setIsTranscribing(false);
    }
  };

  return recognition;
};