import { useState } from "react";
import { Message } from "../components/ChatBox";
import { speak } from "../utils/tts";
import { generateBotReply } from "../services/generativeAIService";

const useChatAPI = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (userMessage: string): Promise<void> => {
    const updatedMessages: Message[] = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(updatedMessages);

    try {
      const reply = await generateBotReply(updatedMessages, userMessage);

      if (reply && reply !== "No response received.") {
        speak(reply);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again later." },
      ]);
    }
  };

  return { messages, sendMessage };
};

export default useChatAPI;
