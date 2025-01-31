import React, { useEffect } from "react";

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  messages: Message[];
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, chatContainerRef }: ChatBoxProps) => {
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="w-full max-w-[800px] p-4 rounded-lg shadow-lg flex flex-col gap-1.5 h-[70vh] max-h-[70vh] overflow-y-auto  bg-white/30"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-md opacity-75 ${
            msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-100 text-black self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
