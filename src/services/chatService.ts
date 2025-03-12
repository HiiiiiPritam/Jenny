import {Message} from '@/store/chatStore'
/**
 * Fetch chat messages from the database
 */
export const fetchChatMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`/api/chat/message/${chatId}`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

/**
 * Save a chat message in the database
 */
export const saveChatMessage = async (chatId: string, message: Message) => {
  try {
    await fetch(`/api/chat/message/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};
