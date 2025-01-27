import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput(""); // Clear input field
    }
  };

  return (
    <div className="flex items-center gap-2 p-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
