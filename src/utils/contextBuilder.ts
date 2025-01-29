import { Message } from "../components/ChatBox";

// Filter out very short messages and prioritize user input
const getKeyMessages = (messages: Message[]): Message[] => {
  // We will iterate backwards through the messages to capture the latest user input and a balanced context
  let keyMessages: Message[] = [];
  let userMessagesCount = 0;

  // Iterate backward to prioritize the user's messages
  for (let i = messages.length - 1; i >= 0 && keyMessages.length < 10; i--) {
    const msg = messages[i];

    // Only include messages that are meaningful (length > 5)
    if (msg.text.length > 5) {
      // Include user messages and their following AI responses
      if (msg.sender === "user") {
        userMessagesCount++;
      }

      keyMessages.unshift(msg);

      // If we have enough user messages, stop adding more AI responses
      if (userMessagesCount >= 3) {
        break;
      }
    }
  }

  return keyMessages;
};

export const buildContext = (messages: Message[]): string => {
  const keyMessages = getKeyMessages(messages);
  return keyMessages
    .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
    .join("\n");
};
