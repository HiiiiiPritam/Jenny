import { useState, useEffect, useRef } from "react";
import { Message } from "../components/ChatBox";
import { speak } from "../utils/tts";
import { generateBotReply, generateImage } from "../services/generativeAIService";
import { set } from "cohere-ai/core/schemas";
// import { getRandomMessage } from "../helpers/getRandomMessage";

const STORAGE_KEY = "chat_messages";
// const LAST_ACTIVE_KEY = "last_active"; // Track last seen time

const useChatAPI = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isTyping, setIsTyping] = useState(false);

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Chat box reference

  const sendMessage = async ({userMessage, isImage}:{userMessage: string, isImage?: boolean}): Promise<void> => {
    if(isImage === undefined) isImage = false;
    let updatedMessages: Message[];
    if(isImage){
       updatedMessages= [
        ...messages,
        { sender: "user", imageUrl: userMessage, text:userMessage, timestamp: Date.now() },
      ];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    }else{
      updatedMessages = [
        ...messages,
        { sender: "user", text: userMessage, timestamp: Date.now() },
      ];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    }
    

    if (isImage) {
      try {
        // Call the image generation service using the userMessage as prompt
        setIsTyping(true);
        const imageUrl = await generateImage(userMessage) as string;
        const botImageMessage: Message = { sender: "bot", imageUrl, timestamp: Date.now() };
        setMessages((prev) => [...prev, botImageMessage]);
        saveMessages([...updatedMessages, botImageMessage]);
        setIsTyping(false);
      } catch (error) {
        console.error("Error generating image:", error);
        const errorMessage: Message = {
          sender: "bot",
          text: "Error generating image. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        saveMessages([...updatedMessages, errorMessage]);
      }
    } else {

      try {

        setIsTyping(true);
        const filteredMessages = updatedMessages.filter((msg) => msg.imageUrl === undefined);
        console.log("filteredMessages", filteredMessages);
        
        const reply = await generateBotReply(filteredMessages, userMessage);
        if (reply && reply !== "No response received.") {
          speak(reply);
        }
        const botMessage: Message = { sender: "bot", text: reply, timestamp: Date.now() };
        setMessages((prev) => [...prev, botMessage]);
        saveMessages([...updatedMessages, botMessage]);
        setIsTyping(false);
      } catch (error) {
        setIsTyping(false);
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          sender: "bot",
          text: "Something went wrong. Please try again later.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        saveMessages([...updatedMessages, errorMessage]);
      }
    }
  };

  // Check if the user was away and simulate AI messages
  // useEffect(() => {
  //   const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
  //   const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  //   if (lastActive && lastMessage) {
  //     const lastActiveTime = parseInt(lastActive, 10);
  //     const timeSinceLastActive = Date.now() - lastActiveTime;

  //     // If the user was gone for more than 1 hour and AI wasn't the last sender
  //     if (timeSinceLastActive > 60 * 60 * 1000 ) {
  //       console.log("Time since last active inside the main useEffect:", timeSinceLastActive);

  //       const aiMessage: Message = { sender: "bot", text: getRandomMessage(), timestamp: Date.now() };

  //       setMessages((prev) => {
  //         const updatedMessages = [...prev, aiMessage];
  //         saveMessages(updatedMessages);
  //         return updatedMessages;
  //       });

  //       speak(aiMessage.text);
  //     }
  //   }

  //   // Update last active time when user is back
  //   localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  // }, []); 
  // Runs only once when the component mounts

  //------------------------------------------------------------------//

  // AI sends a message automatically if the user is inactive
  // const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const sendAutoMessage = () => {
  //     const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  //     if (!lastMessage || Date.now() - lastMessage.timestamp > 60000) {

  //       if(lastMessage) console.log("Time since last message:", Date.now() - lastMessage.timestamp);
  //       else console.log("No last message but still sending AI message");
        
  //       const aiMessage: Message = { sender: "bot", text: getRandomMessage(), timestamp: Date.now() };
  //       setMessages((prev) => {
  //         const updatedMessages = [...prev, aiMessage];
  //         saveMessages(updatedMessages);
  //         return updatedMessages;
  //       });

  //       speak(aiMessage.text);
  //     }
  //   };

  //   // Set a timer for 1-2 minutes (random interval)
  //   const intervalTime = Math.random() * 60000 + 600; // Between 1 to 2 minutes
  //   inactivityTimer.current = setTimeout(sendAutoMessage, intervalTime);

  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //   }

  //   return () => {
  //     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  //   };
  // }, [messages]);
   // Runs only once on mount

  return { messages, sendMessage , chatContainerRef ,isTyping};
};

export default useChatAPI;
