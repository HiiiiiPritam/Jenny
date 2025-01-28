  // Function to handle TTS (Text-to-Speech)
  export const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices()[5] as SpeechSynthesisVoice;
    utterance.rate = 0.8; // Set the speed (1 is normal, 0.5 is slower, 2 is faster)
    utterance.pitch = 1.5; // Set the pitch
    synth.speak(utterance);
  };