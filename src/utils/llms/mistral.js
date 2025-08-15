import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const chatResponse =async(userMessage) =>{
  
  let response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{role: 'user', content: `You are a helpful and friendly AI assistant. You are supportive, encouraging, and professional in your responses. Keep responses under 20 words.\nUser: ${userMessage}\nAssistant:`}],
});
 return response.choices[0].message.content
}

console.log('Chat:', await chatResponse("hello"));