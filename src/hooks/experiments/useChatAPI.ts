// "use client";
// import { useState, useRef, useEffect } from "react";
// import { speak } from "../utils/tts";
// import { generateBotReply, generateImage } from "../services/generativeAIService";
// import { fetchChatMessages, saveChatMessage } from "../services/chatService";
// import { useChatStore } from "@/store/chatStore";

// interface Message {
//   sender: "user" | "bot";
//   text?: string;
//   isImage?: boolean;
//   isVoice?: boolean;
//   imageURL?: string;
//   voiceURL?: string;
//   timestamp: string;
// }

// const useChatAPI = (chatId: string) => {
//   const { messages, selectChat, addMessage } = useChatStore();
//   const [isTyping, setIsTyping] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement | null>(null);

//   // Load messages when chatId changes
//   useEffect(() => {
//     if (!chatId) return;

//     const loadMessages = async () => {
//       setIsTyping(true);
//       try {
//         const fetchedMessages = await fetchChatMessages(chatId);
//         selectChat(chatId); // Set the chat in the store
//       } catch (error) {
//         console.error("Error fetching chat messages:", error);
//       }
//       setIsTyping(false);
//     };

//     loadMessages();
//   }, [chatId]);

//   const sendMessage = async ({ userMessage, isImage = false }: { userMessage: string; isImage?: boolean }): Promise<void> => {
//     let userMsg: Message = {
//       sender: "user",
//       text: isImage ? undefined : userMessage,
//       isImage,
//       imageURL: isImage ? userMessage : undefined,
//       timestamp: new Date().toISOString(),
//     };

//     addMessage(userMsg);
//     await saveChatMessage(chatId, userMsg); // Save user message

//     try {
//       setIsTyping(true);
//       let botMsg: Message;

//       if (isImage) {
//         const imageUrl = await generateImage(userMessage);
//         botMsg = { sender: "bot", imageURL: imageUrl ?? "", isImage: true, timestamp: new Date().toISOString() };
//       } else {
//         const reply = await generateBotReply(messages, userMessage);
//         if (reply && reply !== "No response received.") {
//           speak(reply);
//         }
//         botMsg = { sender: "bot", text: reply, timestamp: new Date().toISOString() };
//       }

//       addMessage(botMsg);
//       await saveChatMessage(chatId, botMsg); // Save bot message
//     } catch (error) {
//       console.error("Error sending message:", error);
//       const errorMessage: Message = { sender: "bot", text: "Something went wrong. Please try again.", timestamp: new Date().toISOString() };
//       addMessage(errorMessage);
//       await saveChatMessage(chatId, errorMessage); // Save error message
//     }

//     setIsTyping(false);
//   };

//   return { messages, sendMessage, chatContainerRef, isTyping };
// };

// export default useChatAPI;
