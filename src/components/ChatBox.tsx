"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./utilities/TypingIndicator";
import {Message} from '@/store/chatStore'
import { useChatStore } from "@/store/chatStore";

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
    <div className="flex flex-col h-full">
      
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#8b5cf6 transparent'
        }}
      >
        <AnimatePresence>
          {messages?.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "bot" && (
                  <img 
                    src={character.profilePicture} 
                    alt={character.name}
                    className="w-8 h-8 rounded-full border border-purple-400 flex-shrink-0 mt-1"
                  />
                )}
                
                <div className={`relative p-4 rounded-2xl shadow-lg ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md" 
                    : "bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700 rounded-bl-md"
                }`}>
                  {/* Message bubble tail */}
                  <div className={`absolute top-3 w-0 h-0 ${
                    msg.sender === "user"
                      ? "right-[-8px] border-l-[8px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                      : "left-[-8px] border-r-[8px] border-r-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                  }`}></div>
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.sender === "bot" && msg.isImage && (
                    <motion.img 
                      src={msg.imageURL} 
                      alt="Generated" 
                      className="mt-3 max-w-full h-auto rounded-xl shadow-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className={`text-xs mt-2 opacity-70 ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-400"
                  }`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {msg.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mt-1">
                    U
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-start gap-3"
          >
            <img 
              src={character.profilePicture} 
              alt={character.name}
              className="w-8 h-8 rounded-full border border-purple-400 flex-shrink-0"
            />
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl rounded-bl-md p-4">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
