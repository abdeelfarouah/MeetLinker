type SpeechRecognitionCallback = (transcript: string) => void;

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isInitialized = false;

  initialize(onTranscript: SpeechRecognitionCallback, onError?: (error: string) => void) {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      onError?.('Speech recognition not supported in this browser');
      return false;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        onTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
      };

      this.recognition = recognition;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      onError?.('Failed to initialize speech recognition');
      return false;
    }
  }

  start() {
    if (!this.isInitialized || !this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        return true;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        return false;
      }
    }
    return false;
  }

  cleanup() {
    if (this.recognition) {
      this.stop();
      this.recognition = null;
      this.isInitialized = false;
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();