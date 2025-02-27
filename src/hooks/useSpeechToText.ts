"use client";

import { useState } from "react";
import { SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from "../types/web-speech";

const useSpeechToText = (onStop: (transcription: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>("");

  const startListening = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US"; // Set language (you can change this)
    recognition.interimResults = false; // Finalized results only
    recognition.maxAlternatives = 1; // Only one result per recognition

    recognition.onstart = () => {
      console.log("Speech recognition started...");
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      console.log("Speech recognized here:", result);
      setTranscribedText(result); // Update state with recognized text
      onStop(result); // Immediately pass the result to the parent
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition stopped.");
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (isListening) {
      console.log("Stopping speech recognition...");
      setIsListening(false);
    }
  };

  return { isListening, transcribedText, startListening, stopListening };
};

export default useSpeechToText;
