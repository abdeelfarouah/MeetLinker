/**
 * Minimal TypeScript declarations for the Web Speech API.
 * This file provides the necessary types for SpeechRecognition.
 */

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, event: Event) => void) | null;
  onaudiostart: ((this: SpeechRecognition, event: Event) => void) | null;
  onsoundstart: ((this: SpeechRecognition, event: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognition, event: Event) => void) | null;
  onsoundend: ((this: SpeechRecognition, event: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, event: Event) => void) | null;
  onaudioend: ((this: SpeechRecognition, event: Event) => void) | null;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

declare const SpeechRecognition: SpeechRecognitionStatic;

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
} 