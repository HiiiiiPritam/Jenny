"use client";

import React, { useEffect } from "react";
import TypingIndicator from "./utilities/TypingIndicator";
import {Message} from '@/store/chatStore'
import { useChatStore } from "@/store/chatStore";
import { div } from "framer-motion/client";

interface ChatBoxProps {
  messages: Message[];
  isTyping: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, chatContainerRef, isTyping}: ChatBoxProps) => {
  // Scroll to the bottom whenever messages change
  const { selectedChat } = useChatStore();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedChat) {
    return <div className="p-4">No chat selected</div>;
  }

  const { character } = selectedChat;

  return (
    <div >
      <div className="flex gap-2 h-10">
      <img className="rounded-full" src={character.profilePicture} alt="character pp" />
      <span className="text-white  font-bold">{character.name}</span>
      </div>
      
    <div
      ref={chatContainerRef}
      className="w-full max-w-[800px] p-4 rounded-lg shadow-lg flex flex-col gap-1.5 h-[70vh] max-h-[70vh] overflow-y-auto  bg-white/30"
    >
      {messages?.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-md opacity-75 ${
            msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-100 text-black self-start"
          }`}
        >
          {msg.text}
          {msg.sender === "bot" && msg.isImage && <img src={msg.imageURL} alt="Generated" className="max-w-[300px] rounded-md mt-2" />}
        </div>
      ))}
      {isTyping && (
        <TypingIndicator />
      )}
    </div>
    </div>
  );
};

export default ChatBox;
