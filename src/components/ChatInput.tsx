import React, { useState, useEffect } from "react";
import useSpeechToText from "../hooks/useSpeechToText";

interface ChatInputProps {
  onSend: (message: string) => void; // Function to send a message to the parent
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState<string>("");

  // Speech-to-Text hook
  const { isListening, transcribedText, startListening, stopListening } =
    useSpeechToText((transcription) => {
      // Automatically send transcription to parent on stop
      console.log("Transcription:", transcription);
      if (transcription.trim()) {
        setInput(transcription); // Set input immediately
        onSend(transcription);
      }
    });

  const handleSend = () => {
    if (input.trim()) {
      onSend(input); // Pass input to parent for sending
      setInput(""); // Clear input field after sending
    }
  };

  useEffect(() => {
    if (transcribedText && !isListening) {
      // Only update input when transcription is finalized (not during interim results)
      setInput(transcribedText);
    }
  }, [transcribedText, isListening]);

  return (
    <div className="flex flex-wrap w-full max-w-[800px] items-center gap-2 p-4">
    {/* Input field for typing */}
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="flex-1 p-2 border rounded-md min-w-[150px] sm:min-w-[250px] max-w-full"
      placeholder="Type a message or use the mic..."
    />
    {/* Speech-to-Text Button */}
    <button
      onClick={isListening ? stopListening : startListening}
      className={`px-4 py-2 rounded-md ${
        isListening ? "bg-red-600" : "bg-green-600"
      } text-white hover:opacity-80 min-w-[80px]`}
    >
      {isListening ? "Stop" : "Speak"}
    </button>
    {/* Send Button */}
    <button
      onClick={handleSend}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[80px]"
    >
      Send
    </button>
  </div>
  );
};

export default ChatInput;
