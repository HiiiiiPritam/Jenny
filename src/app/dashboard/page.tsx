"use client";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import { useChatStore } from "@/store/chatStore";
import useCharacterStore from "@/store/useCharacterStore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";



const ExplorePage = () => {
  const { characters, fetchCharacters } = useCharacterStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);
  const { data: session } = useSession();
  const { fetchUserChats } = useChatStore();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (characters.length === 0) { // ✅ Fetch only if no characters exist
      const loadCharacters = async () => {
        await fetchCharacters();
        setLoading(false);
      };
      loadCharacters();
    } else {
      setLoading(false); // ✅ Avoid unnecessary loading state
    }
  }, [characters.length]); // ✅ Depend only on `characters.length`
  

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black">
        <div className="text-white text-xl">Please login first</div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)] bg-gradient-to-br from-darkPurple to-black">
        <LoadingSpinner size="lg" message="Loading characters..." />
      </div>
    );
  }

  const createChat = async (characterId: string) => {
    const userId = session?.user?.id;
    setCreatingChat(characterId);
    
    try {
      const response = await fetch(`/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterId }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Chat created successfully! Redirecting...", "success");
        await fetchUserChats({ userID: userId });
        setTimeout(() => {
          router.push(`/dashboard/my-chats/${data._id}`);
        }, 1000);
      } else {
        if (data.error === "Chat already exists") {
          showToast("Chat already exists! Redirecting...", "info");
          await fetchUserChats({ userID: userId });
          setTimeout(() => {
            router.push(`/dashboard/my-chats/${data.chatId}`);
          }, 1000);
        } else {
          showToast(data.error || "Something went wrong", "error");
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      showToast("Failed to create chat. Please try again.", "error");
    } finally {
      setCreatingChat(null);
    }
  };

  return (
    <>
      <div className="bg-black text-white flex flex-col h-[calc(100dvh-4rem)]  overflow-hidden px-6 relative ">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkPurple to-black opacity-60"></div>

        {/* Floating Background Effect */}
        <BackgroundEffect />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-matteRed drop-shadow-lg text-center z-10"
        >
          Explore AI Characters
        </motion.h1>

        {/* Character Grid */}
        <div className="relative z-10 flex-1 mt-6 overflow-y-auto overflow-x-hidden w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 z-10">
            {characters.map((char) => (
              <motion.div
                key={char._id}
                onClick={() => !creatingChat && createChat(char._id)}
                className={`bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden ${
                  creatingChat === char._id
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-opacity-20 hover:shadow-2xl"
                }`}
                whileHover={creatingChat === char._id ? {} : { scale: 1.02, y: -5 }}
                whileTap={creatingChat === char._id ? {} : { scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: characters.indexOf(char) * 0.1 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-matteRed/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                {/* Loading overlay */}
                {creatingChat === char._id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10">
                    <LoadingSpinner size="md" message="Creating chat..." />
                  </div>
                )}
                
                <div className="relative z-5">
                  <div className="overflow-hidden rounded-lg mb-4 group">
                    <img
                      src={char.profilePicture}
                      alt={char.name}
                      className="w-full h-80 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-matteRed transition-colors duration-300">
                    {char.name}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {char.description}
                  </p>
                  
                  {/* Action indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Click to chat</span>
                    <motion.div
                      className="text-matteRed text-lg"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default ExplorePage;
