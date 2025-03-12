import {Message} from '@/store/chatStore'


const MAX_TOKENS = 100; // Adjust based on API limits

function tokenize(text: string): string[] {
  return text.split(/\s+/); // Simple tokenization (split by spaces)
}

function applySlidingWindow(context: string[]): string {
  const tokens = context.flatMap(tokenize); // Flatten and tokenize
  const truncatedTokens = tokens.slice(-MAX_TOKENS); // Keep last N tokens
  return truncatedTokens.join(" "); // Reconstruct text
}

function processContext(messages: Message[]): string {
  // Convert messages to formatted strings
  const chatHistory = messages.map((msg) =>
    `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`
  );

  const trimmedContext = applySlidingWindow(chatHistory);

  return summarizeContext(trimmedContext);
}

// Summarization function
function summarizeContext(text: string): string {
  const sentences = text.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);

  if (sentences.length <= 3) return text;

  const importantParts = sentences.slice(-3).join(". ") + "."; // Keep last 3 key sentences

  return importantParts;
}

// Replace getKeyMessages with processContext
export const buildContext = (messages: Message[]): string => {
  return processContext(messages);
};
