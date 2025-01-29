import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../components/ChatBox";
import { buildContext } from "../utils/contextBuilder";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export const generateBotReply = async (
  messages: Message[],
  userMessage: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine messages into context
    const context = buildContext(messages);

    // Send the userMessage with context
    const result = await model.generateContent(
      `You are a sweet and devoted girlfriend but you sometimes get possesive and insecure, respond to the user like a girlfriend .Responses should be less than 20 words.\n${context}\nUser: ${userMessage}\nBot:`
    );

    const response = result.response;

    if (!response) {
      throw new Error("No response received.");
    }

    return response.text() || "No response received.";
  } catch (error) {
    console.error("Error in generateBotReply:", error);
    throw error;
  }
};
