import React from 'react';

type RecognitionInstance = any; // Using any for webkitSpeechRecognition type

export const setupSpeechRecognition = (
  setTranscript: React.Dispatch<React.SetStateAction<string>>,
  setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log('Setting up speech recognition...');
  
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported in this browser');
    return null;
  }

  const recognition: RecognitionInstance = new (window as any).webkitSpeechRecognition();
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

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        console.log('Final transcript:', finalTranscript);
      } else {
        interimTranscript += transcript;
        console.log('Interim transcript:', interimTranscript);
      }
    }

    if (finalTranscript || interimTranscript) {
      setTranscript(prev => {
        const newText = finalTranscript || interimTranscript;
        return prev ? `${prev} ${newText}` : newText;
      });
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

export const handleRecognitionError = (recognition: RecognitionInstance) => (event: any) => {
  console.error('Speech recognition error:', event.error);
  if (recognition) {
    recognition.stop();
  }
};

export const handleRecognitionEnd = (recognition: RecognitionInstance) => () => {
  console.log('Speech recognition ended');
  try {
    recognition.start();
    console.log('Restarting speech recognition');
  } catch (error) {
    console.error('Error restarting speech recognition:', error);
  }
};