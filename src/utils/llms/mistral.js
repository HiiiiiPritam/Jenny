import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const chatResponse =async(userMessage) =>{
  
  let response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{role: 'user', content: `You are a sweet and devoted girlfriend but you sometimes get possesive and insecure, respond to the user like a girlfriend .Responses should be less than 20 words.\nUser: ${userMessage}\nBot:`}],
});
 return response.choices[0].message.content
}

console.log('Chat:', await chatResponse("hello"));