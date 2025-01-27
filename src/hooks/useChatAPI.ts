import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../components/ChatBox";

const useChatAPI = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (userMessage: string): Promise<void> => {
    // Add the user's message to the chat
    const updatedMessages: Message[] = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(updatedMessages);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      

      // Combine messages into context
      const context = updatedMessages
        .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
        .join("\n");

      // Send the userMessage with context
      const result = await model.generateContent(`Keep the response short.\n${context}\nUser: ${userMessage}\nBot:`,
      );

      const response = result.response;

      if (!response) {
        throw new Error("No response received.");
      }

      const reply = response.text() || "No response received.";
      console.log("Bot reply:", reply);
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
