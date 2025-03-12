"use client";
import { useState, useRef, useEffect } from "react";
import { speak } from "../utils/tts";
import { generateBotReply, generateImage } from "../services/generativeAIService";
import { fetchChatMessages, saveChatMessage } from "../services/chatService";
import { useChatStore } from "@/store/chatStore";
import {Message} from '@/store/chatStore'


const useChatAPI = (chatId: string) => {
  const { messages, selectChat, addMessage ,selectedChat} = useChatStore();
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Load messages when chatId changes
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setIsTyping(true);
      try {
        const fetchedMessages = await fetchChatMessages(chatId);
        selectChat(chatId); // Set the chat in the store
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
      setIsTyping(false);
    };

    loadMessages();
  }, [chatId]);

  const sendMessage = async ({ userMessage, isImage = false }: { userMessage: string; isImage?: boolean }): Promise<void> => {
    let userMsg: Message = {
      sender: "user",
      text: userMessage,
      isImage,
      isVoice: false,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    await saveChatMessage(chatId, userMsg); 

    try {
      setIsTyping(true);
      let botMsg: Message;

      if (isImage) {
        const imageUrl = await generateImage({userMessage,baseprompt:selectedChat?.character.baseImagePrompt as string});
        botMsg = { sender: "bot", imageURL: imageUrl ?? "", isImage: true, timestamp: new Date().toISOString() };
      } else {
        const filteredMessages = messages.filter((msg)=> msg.sender==="bot" && msg.isImage)
        const reply = await generateBotReply(messages, userMessage,selectedChat?.character.basePersonalityPrompt as string);
        if (reply && reply !== "No response received.") {
          speak(reply);
        }
        botMsg = { sender: "bot", text: reply, timestamp: new Date().toISOString() };
      }

      addMessage(botMsg);
      await saveChatMessage(chatId, botMsg); // Save bot message
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { sender: "bot", text: "Something went wrong. Please try again.", timestamp: new Date().toISOString() };
      addMessage(errorMessage);
      await saveChatMessage(chatId, errorMessage); // Save error message
    }

    setIsTyping(false);
  };

  return { messages, sendMessage, chatContainerRef, isTyping };
};

export default useChatAPI;
