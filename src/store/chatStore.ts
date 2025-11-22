import { create } from "zustand";
import { Character } from "./useCharacterStore";

export interface Message {
  sender: "user" | "bot";
  text?: string;
  isImage?: boolean;
  isVoice?: boolean;
  imageURL?: string;
  voiceURL?: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  user: string;
  character: Character;
  messages: Message[];
}

interface ChatState {
  chats: Chat[]; // All user's chats
  selectedChatId: string | null; // ID of the currently selected chat
  selectedChat: Chat | null;
  messages: Message[]; // Messages of the selected chat

  fetchUserChats: ({ userID }: { userID: string }) => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  selectedChatId: null,
  messages: [],
  selectedChat: null,

  // Fetch all chats of the current user
  fetchUserChats: async ({ userID }: { userID: string }) => {
    try {
      const response = await fetch(`/api/chat/user/${userID}`);
      if (!response.ok) throw new Error("Failed to fetch chats");
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        set({ chats: data });
      } else {
        console.error("Fetched chats data is not an array:", data);
        set({ chats: [] });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({ chats: [] });
    }
  },

  // Select a chat and load its messages
  selectChat: async (chatId) => {
    const { chats, selectedChatId } = get();

    // If already selected, don't re-fetch unless forced (logic can be added later)
    if (selectedChatId === chatId) return;

    const chat = chats.find((c) => String(c._id) === String(chatId)) || null;

    if (!chat) {
      console.warn(`Chat with ID ${chatId} not found in local state, fetching...`);
      // Optional: Fetch single chat if not found in list (omitted for now to stick to plan)
    }

    try {
      // Optimistic update or just set the chat object first
      set({ selectedChat: chat, selectedChatId: chatId, messages: [] });

      const response = await fetch(`/api/chat/message/${chatId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      
      set({
        messages: data.messages || [],
      });
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      set({ messages: [] });
    }
  },

  // Add a new message to the selected chat
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
