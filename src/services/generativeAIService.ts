import {Message} from '@/store/chatStore'

import { buildContext } from "../utils/contextBuilder";
import { CohereClientV2 } from "cohere-ai";


const cohere = new CohereClientV2({
  token: process.env.NEXT_PUBLIC_COHERE_AI_KEY,
});

export const generateBotReply = async (
  messages: Message[],
  userMessage: string,
  baseprompt:string,
): Promise<string> => {

  const context = buildContext(messages);

  console.log("context", context);
  
  const prompt = `Responses should be less than 15 words. Act as the character mentioned below. ${baseprompt}.\n:${context}\nUser: ${userMessage}\nBot:`;

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

    return botResponse;
  } catch (error) {
    console.error("Error in generateBotReply:", error);
    throw error;
  }
};

export const generateImage = async ({userMessage, baseprompt=""}: {userMessage:string, baseprompt?:string}): Promise<string | null> => {
  try {

    const prompt = baseprompt !==""? baseprompt+'. '+userMessage:userMessage
    console.log(prompt);
    
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1920&nologo=true&private=true&enhance=true&safe=false`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.url; // Pollinations serves images directly via URL
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};

