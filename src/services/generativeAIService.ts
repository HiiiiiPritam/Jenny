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
  
  const prompt = `Responses should be less than 15 words. Act as a helpful AI assistant with the personality described below. ${baseprompt}.\n:${context}\nUser: ${userMessage}\nAssistant:`;

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
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

export const generateVideoPrompts = async (basePrompt: string): Promise<string[]> => {
  try {
    const prompt = `Generate 5 sequential, descriptive image prompts to create a short, coherent video story based on the following theme: "${basePrompt}". 
    Each prompt should be detailed but concise (under 30 words). 
    Return ONLY the 5 prompts, separated by a newline character. Do not include numbering or extra text.`;

    const response = await cohere.chat({
      model: "command-r-plus", // Using a capable model for creativity
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (response && response.message && response.message.content) {
      const text = response.message.content[0].text;
      // Split by newline and filter out empty lines
      const prompts = text.split('\n').filter(line => line.trim() !== '').slice(0, 5);
      
      // Fallback if splitting fails or returns too few
      if (prompts.length < 5) {
        console.warn("Cohere returned fewer than 5 prompts, filling with base prompt variations.");
        while (prompts.length < 5) {
          prompts.push(`${basePrompt} - scene ${prompts.length + 1}`);
        }
      }
      return prompts;
    }
    
    throw new Error("No response content from Cohere");
  } catch (error) {
    console.error("Error generating video prompts:", error);
    // Fallback to base prompt variations if AI fails
    return Array(5).fill(basePrompt).map((p, i) => `${p} - variation ${i + 1}`);
  }
};

export const generateProactiveMessage = async (
  characterName: string,
  userName: string,
  personality: string,
  lastMessages: string
): Promise<string> => {
  const prompt = `
    You are ${characterName}, a loving AI girlfriend. You are in a relationship with ${userName}.
    Your personality: ${personality}.
    
    Context of recent chat:
    ${lastMessages}
    
    Task: Send a short, natural, proactive message to ${userName} as if you are checking in on them or sharing a moment. 
    It should NOT sound like a bot. It should sound like a real girlfriend sending a text.
    Keep it under 20 words.
    Do not repeat recent messages.
    
    Message:
  `;

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [{ role: "user", content: prompt }],
    });

    if (response && response.message && response.message.content) {
      return response.message.content[0].text.replace(/^["']|["']$/g, '').trim();
    }
    return "Thinking of you! ❤️";
  } catch (error) {
    console.error("Error generating proactive message:", error);
    return "Hey, just wanted to say hi! ❤️";
  }
};
