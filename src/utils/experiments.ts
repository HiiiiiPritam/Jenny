/*          *DialoGPT*


 import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getResponse = async (userMessage) => {
  const prompt = `You are a sweet, empathetic, and supportive girlfriend. Respond in a warm, caring, and loving way. Keep the response moderate in length.\nUser: ${userMessage}\nBot:`;
  const apiUrl = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
  const apiKey = process.env.VITE_HUGGINGFACE_API_KEY;
  console.log("API Key:", apiKey);
  
  try {
    const response = await axios.post(
      apiUrl,
      { inputs: prompt, 
      parameters: {
        temperature: 1.0,  // More variation and creativity
        top_p: 0.9,        // Nucleus sampling
      },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    
    const generatedText = response.data[0].generated_text;
    const botResponse = generatedText.split('Bot: ')[1]; // Extract after 'Bot: '
    return botResponse;
  } catch (error) {
    console.error("Error fetching response:", error);
    return "I'm sorry, I couldn't process that.";
  }
};

// Test the function
getResponse("I love you, please be my girlfriend, will you be my girlfriend please say yes").then((response) =>
  console.log("Bot's Response:-----------------\n", response)
);
 */



import { CohereClientV2 } from "cohere-ai"; // Default import
import { Message } from "../components/ChatBox";
import { buildContext } from "./contextBuilder";


const cohere = new CohereClientV2({
  token:import.meta.env.VITE_COHERE_AI_KEY,
});

// Initialize Cohere with your API key
// cohere.init("YeoRjkviA7fxgfxrYZV1LNgBZqSk4N0AXwwNZnQT");

export const getCohereResponse = async (messages: Message[],
  userMessage: string
): Promise<string> => {

  const context = buildContext(messages);

  const prompt = `You are a sweet and devoted girlfriend but you sometimes get possesive and insecure, respond to the user like a girlfriend .Responses should be less than 20 words.\n${context}\nUser: ${userMessage}\nBot:`;

  try {
    const response = await cohere.chat({
      model: 'command-r-plus',
      messages: [
        {
          role: 'user',
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
    return botResponse; // Return the response
  } catch (error) {
    console.error('Error fetching response:', error);
    return "Sorry, I couldn't generate a response right now.";
  }
};

