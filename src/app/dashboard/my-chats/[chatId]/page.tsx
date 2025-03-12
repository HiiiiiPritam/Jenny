"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import useChatAPI from "@/hooks/useChatAPI";
import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";


const ChatPage = () => {
  const params = useParams();
  const chatId = params?.chatId as string;
  console.log("chatID",params, chatId);
  
  const { messages, sendMessage,chatContainerRef,isTyping } = useChatAPI(chatId);
  const { selectChat, selectedChat } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    if (!chatId) return;
    selectChat(chatId as string); // Set selected chat
  }, []);

  return (
    <div className="p-6 inset-0 bg-gradient-to-br from-darkPurple to-black max-h-[calc(100dvh-4rem)] overflow-auto relative z-10">
      <button onClick={() => router.push("/dashboard/my-chats")} className="mb-4 text-blue-500">
        ← Back to My Chats
      </button>

      <ChatBox messages={messages} isTyping={isTyping} chatContainerRef={chatContainerRef} />
      <ChatInput onSend={(userMessage, isImage) => sendMessage({ userMessage, isImage })} isTyping={isTyping} />
    </div>
  );
};

export default ChatPage;
