// src/types/web-speech.d.ts

export interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
  readonly isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

export declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};
