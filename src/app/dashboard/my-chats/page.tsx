"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const MyChats = () => {
  const { data: session, status } = useSession();
  const { chats, fetchUserChats } = useChatStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ✅ Ensure hooks are not conditionally called
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return; // ✅ Prevent running with undefined session
    const loadChats = async () => {
      setLoading(true);
      await fetchUserChats({ userID: userId });
      setLoading(false);
    };

    loadChats();
  }, [userId, fetchUserChats]); // ✅ Dependencies properly set

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
        <div className="text-white text-xl">Please login to view your chats</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black relative overflow-hidden">
      {/* Background Animated Effects */}
      <BackgroundEffect />

      {/* Header */}
      <motion.div
        className="relative z-10 p-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-matteRed">
            My Chats
          </h1>
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </motion.button>
        </div>
        <p className="text-gray-400 text-lg">
          {chats.length > 0 ? `${chats.length} conversation${chats.length !== 1 ? 's' : ''}` : 'No conversations yet'}
        </p>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 px-6 pb-6 overflow-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#8b5cf6 transparent'
      }}>

      {/* Content Area */}
      <div className="relative z-10 flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" message="Loading chats..." />
          </div>
        ) : chats.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No chats yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">Start a conversation with an AI character to see your chats here.</p>
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Characters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {Array.isArray(chats) && chats.map((chat, index) => (
              <motion.div
                key={chat._id}
                onClick={() => router.push(`/dashboard/my-chats/${chat._id}`)}
                className="group cursor-pointer bg-gradient-to-br from-purple-900/40 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 transition-all duration-300 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                {/* Character info */}
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full border-2 border-purple-400/50 group-hover:border-purple-400 transition-colors duration-300 object-cover"
                      src={chat.character.profilePicture}
                      alt={chat.character.name}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors duration-300 truncate">
                      {chat.character.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      AI Character
                    </p>
                  </div>
                </div>
                
                {/* Last message preview */}
                <div className="relative z-10 mb-4">
                  <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                    {chat.character.description || "Start a conversation..."}
                  </p>
                </div>
                
                {/* Action area */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Click to continue
                  </span>
                  <motion.div
                    className="text-purple-400 text-lg"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MyChats;
