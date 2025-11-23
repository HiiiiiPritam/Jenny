"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import useChatAPI from "@/hooks/useChatAPI";
import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";

import CallOverlay from "@/components/CallOverlay";

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const chatId = params?.chatId as string;
  const userId = session?.user?.id;

  const { messages, sendMessage, chatContainerRef, isTyping } = useChatAPI(chatId);
  const { selectChat, chats, fetchUserChats, selectedChat } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [isCallOpen, setIsCallOpen] = useState(false);

  useEffect(() => {
    if (!chatId || !userId) return;

    const initChat = async () => {
      setLoading(true);
      try {
        await selectChat(chatId);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [chatId, userId, selectChat]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black">
        <LoadingSpinner size="lg" message="Loading session..." />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black">
        <div className="text-white text-xl">Please login to access this chat</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black relative overflow-hidden">
      {/* Header with back button */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm border-b border-purple-500/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          onClick={() => router.push("/dashboard/my-chats")} 
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-500/10"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Chats
        </motion.button>

        {/* Phone Call Button */}
        <motion.button
          onClick={() => setIsCallOpen(true)}
          className="p-2 bg-green-600/20 text-green-400 rounded-full border border-green-500/30 hover:bg-green-600/30 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Start Call"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Chat content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading chat..." />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat messages area */}
          <div className="flex-1 min-h-0">
            <ChatBox messages={messages} isTyping={isTyping} chatContainerRef={chatContainerRef} />
          </div>
          
          {/* Chat input area */}
          <div className="flex-shrink-0">
            <ChatInput onSend={(userMessage, isImage, isVoiceEnabled) => sendMessage({ userMessage, isImage, isVoiceEnabled })} isTyping={isTyping} />
          </div>
        </div>
      )}

      {/* Phone Call Overlay */}
      {selectedChat && (
        <CallOverlay
          isOpen={isCallOpen}
          onClose={() => setIsCallOpen(false)}
          character={selectedChat.character}
          onSendMessage={async (text) => {
             return await sendMessage({ userMessage: text, isVoiceEnabled: false });
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
