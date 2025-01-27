import React from "react";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }: ChatBoxProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 h-[80vh] overflow-y-auto rounded-md">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-md ${
            msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
