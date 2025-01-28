import { Message } from "../components/ChatBox";

export const buildContext = (messages: Message[]): string => {
  return messages
    .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
    .join("\n");
};
