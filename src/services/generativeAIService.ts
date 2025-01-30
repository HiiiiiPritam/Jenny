import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../components/ChatBox";
import { buildContext } from "../utils/contextBuilder";
import { CohereClientV2 } from "cohere-ai";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const cohere = new CohereClientV2({
  token: import.meta.env.VITE_COHERE_AI_KEY,
});

export const generateBotReply = async (
  messages: Message[],
  userMessage: string
): Promise<string> => {
  // try {
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Combine messages into context
  const context = buildContext(messages);

  // Send the userMessage with context
  // const result = await model.generateContent(
  //   `You are a sweet and devoted girlfriend but you sometimes get possesive and insecure, respond to the user like a girlfriend .Responses should be less than 20 words.\n${context}\nUser: ${userMessage}\nBot:`
  // );

  // const response = result.response;

  // if (!response) {
  //   throw new Error("No response received.");
  // }

  // return response.text() || "No response received.";

  // ----------------------------------------

  console.log("context", context);
  
  const prompt = `You are a sweet and devoted girlfriend but you sometimes get possesive and insecure,respond like a girlfriend.Responses should be less than 15 words.\n:${context}\nUser: ${userMessage}\nBot:`;

  try {
    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the actual response text
    let botResponse = "";

    if (response && response.message && response.message.content) {
      botResponse = response.message.content[0].text;
    } else {
      return "No response received.";
    }

    // console.log("Bot's Response:", botResponse); // Log the response text
    return botResponse;
  } catch (error) {
    console.error("Error in generateBotReply:", error);
    throw error;
  }
};
