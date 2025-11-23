  // Function to handle TTS (Text-to-Speech)
  // Function to handle TTS (Text-to-Speech)
  export const speak = (text: string, onEnd?: () => void) => {
    // Cancel any ongoing speech to avoid overlap
    window.speechSynthesis.cancel();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to select a female voice or a specific one if available
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Female")) || voices[0];
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch

    if (onEnd) {
      utterance.onend = onEnd;
    }

    synth.speak(utterance);
  };