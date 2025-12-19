"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiPlus, FiClock, FiTrash2, FiChevronRight } from "react-icons/fi";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const MyChats = () => {
  const { data: session, status } = useSession();
  const { chats, fetchUserChats } = useChatStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      const loadChats = async () => {
        setLoading(true);
        await fetchUserChats({ userID: session.user.id });
        setLoading(false);
      };
      loadChats();
    }
  }, [session?.user?.id, fetchUserChats]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <LoadingSpinner size="lg" message="Loading your conversations..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <div className="text-white/50 text-xl font-medium tracking-tight">Please login to view your chats</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent text-white flex flex-col px-8 py-10 relative">
      <BackgroundEffect />
      
      {/* Header */}
      <header className="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest">
            <FiMessageSquare /> Active Conversations
          </div>
          <h1 className="text-5xl font-bold tracking-tighter">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Chats</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            {chats.length > 0 
              ? `You have ${chats.length} ongoing conversation${chats.length !== 1 ? 's' : ''}.`
              : "No conversations started yet. Find a companion to begin."
            }
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="relative group px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5"
        >
          <FiPlus /> New Chat
        </button>
      </header>

      {/* Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="md" />
          </div>
        ) : chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-96 text-center space-y-6 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-md"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group">
              <FiMessageSquare className="text-gray-600 group-hover:text-pink-500 transition-colors" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Silence is golden, but chat is better</h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm">You haven't started any conversations yet. Explore our characters to find your match.</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-pink-600/20"
            >
              Start Exploring
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
            {chats.map((chat, index) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/my-chats/${chat._id}`)}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 cursor-pointer hover:border-pink-500/30 hover:bg-white/[0.02] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={chat.character.profilePicture}
                      alt={chat.character.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0a0a0a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate group-hover:text-pink-500 transition-colors">{chat.character.name}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{chat.character.assistantRole || "Companion"}</p>
                  </div>
                  <button className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                    <FiTrash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 min-h-[5rem]">
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed italic">
                      {(chat.messages || []).length > 0 
                        ? `"${chat.messages[chat.messages.length - 1].text}"`
                        : "No messages yet. Send a greeting!"
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-2">
                    <div className="flex items-center gap-1.5">
                      <FiClock /> 
                      {(chat.messages || []).length > 0 
                        ? new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleDateString()
                        : "New"
                      }
                    </div>
                    <div className="flex items-center gap-1 text-pink-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      Open Chat <FiChevronRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
