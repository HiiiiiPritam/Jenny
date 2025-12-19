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

    // If already selected, don't re-fetch unless forced
    if (selectedChatId === chatId && get().selectedChat) return;

    let chat = chats.find((c) => String(c._id) === String(chatId)) || null;

    try {
      // If chat not found in local list, fetch it from the server
      if (!chat) {
        console.log(`Chat ${chatId} not found in store, fetching...`);
        const response = await fetch(`/api/chat/message/${chatId}`);
        if (!response.ok) throw new Error("Failed to fetch chat");
        chat = await response.json();
      }

      set({ 
        selectedChat: chat, 
        selectedChatId: chatId, 
        messages: chat?.messages || [] 
      });

    } catch (error) {
      console.error("Error selecting chat:", error);
      set({ selectedChat: null, selectedChatId: null, messages: [] });
    }
  },

  // Add a new message to the selected chat
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
