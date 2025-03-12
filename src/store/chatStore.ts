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
      const data: Chat[] = await response.json();
      console.log("chats data", data);

      set({ chats: data });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  },

  // Select a chat and load its messages
  selectChat: async (chatId) => {
    const { chats } = get();

    // console.log("Current chats:", chats); // ✅ Debug current chats
    // console.log("Looking for chat with ID:", chatId); // ✅ Debug chatId

    const chat = chats.find((c) => String(c._id) === String(chatId)) || null; // ✅ Ensure type match

    // console.log("Selected chat:", chat); // ✅ Debug selected chat

    if (!chat) {
      console.error(`Chat with ID ${chatId} not found in state`);
      return;
    }

    try {
      const response = await fetch(`/api/chat/message/${chatId}`);
      const data: any = await response.json();
      console.log("chat in selectcchat", chatId, "is", chat);

      set({
        selectedChat: chat,
        selectedChatId: chatId,
        messages: data.messages,
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  },

  // Add a new message to the selected chat
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
