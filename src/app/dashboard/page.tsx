"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiTrendingUp, FiHash, FiSearch } from "react-icons/fi";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import useCharacterStore from "@/store/useCharacterStore";
import { useChatStore } from "@/store/chatStore";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ExplorePage = () => {
  const { characters, fetchCharacters } = useCharacterStore();
  const { fetchUserChats } = useChatStore();
  const { toast, showToast, hideToast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (characters.length === 0) {
        await fetchCharacters();
      }
      setLoading(false);
    };
    loadData();
  }, [characters.length, fetchCharacters]);

  const createChat = async (characterId: string) => {
    if (!session?.user?.id) return;
    setCreatingChat(characterId);
    
    try {
      const response = await fetch(`/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, characterId }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Starting new conversation...", "success");
        await fetchUserChats({ userID: session.user.id });
        router.push(`/dashboard/my-chats/${data._id}`);
      } else if (data.error === "Chat already exists") {
        showToast("Opening existing conversation...", "info");
        router.push(`/dashboard/my-chats/${data.chatId}`);
      } else {
        showToast(data.error || "Failed to start chat", "error");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setCreatingChat(null);
    }
  };

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (char.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <LoadingSpinner size="lg" message="Discovering companions..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent text-white flex flex-col px-4 md:px-8 pt-24 md:pt-10 relative group/explore">
      <BackgroundEffect />
      
      {/* Header Section */}
      <header className="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-pink-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">
            <FiTrendingUp /> Trending Companions
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Jenn-ies</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Find the perfect AI personality to chat, learn, or share experiences with.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all backdrop-blur-md"
          />
        </div>
      </header>

      {/* Main Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
            {filteredCharacters.map((char, index) => (
              <motion.div
                key={char._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => !creatingChat && createChat(char._id)}
              >
                {/* Character Card */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#111] border border-white/5 group-hover:border-pink-500/30 transition-all duration-500 shadow-2xl">
                  {/* Background Image */}
                  <img
                    src={char.profilePicture}
                    alt={char.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-pink-600/20 text-pink-400 text-[10px] font-bold uppercase tracking-wider border border-pink-600/30">
                          {char.assistantRole || "Companion"}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                          <FiTrendingUp className="text-green-500" /> Hot
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold group-hover:text-pink-500 transition-colors">
                        {char.name}
                      </h3>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {char.description}
                      </p>
                      
                      <button 
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          creatingChat === char._id 
                            ? "bg-gray-800 text-gray-500" 
                            : "bg-white text-black hover:bg-pink-500 hover:text-white"
                        }`}
                      >
                        {creatingChat === char._id ? (
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiMessageSquare /> Chat Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Online</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <FiHash className="text-gray-600" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="text-gray-500">Try searching for something else or explore all characters.</p>
            </div>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-pink-500 font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default ExplorePage;
