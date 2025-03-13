"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import useChatAPI from "@/hooks/useChatAPI";
import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";
import { useSession } from "next-auth/react";

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const chatId = params?.chatId as string;
  const userId = session?.user?.id;

  const { messages, sendMessage, chatContainerRef, isTyping } = useChatAPI(chatId);
  const { selectChat, chats, fetchUserChats } = useChatStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !chatId) return; // ✅ Ensure valid data before fetching

    if (!chatId || !session?.user?.id) return;
    setLoading(true)

    // Ensure chats are loaded first, then select the chat
    const fetchAndSelectChat = async () => {
      // await fetchUserChats({ userID: session.user.id }); // Wait for chats
      await selectChat(chatId).then(()=>setLoading(false)); // Now select chat when state is updated
    };
    
    
    fetchAndSelectChat();
    
  }, [userId, chatId, fetchUserChats, selectChat]);

  if (status === "loading") {
    return <div className="text-center text-white">Loading session...</div>;
  }

  if (!userId) {
    return <div className="text-center text-white">User not present</div>;
  }

  return (
    <div className="px-6 inset-0 bg-gradient-to-br from-darkPurple to-black max-h-[calc(100dvh-4rem)] overflow-auto relative z-10 w-full ">
      <button onClick={() => router.push("/dashboard/my-chats")} className="mb-1 text-blue-500">
        ← Back to My Chats
      </button>

      {/* Show loading while fetching chats */}
      {loading ? (
        <div className="text-center text-gray-400">Loading chat...</div>
      ) : (
        <>
          <ChatBox messages={messages} isTyping={isTyping} chatContainerRef={chatContainerRef} />
          <ChatInput onSend={(userMessage, isImage) => sendMessage({ userMessage, isImage })} isTyping={isTyping} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
