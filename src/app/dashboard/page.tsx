"use client";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import { useChatStore } from "@/store/chatStore";
import useCharacterStore from "@/store/useCharacterStore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const ExplorePage = () => {
  const { characters, fetchCharacters } = useCharacterStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const{fetchUserChats}= useChatStore()

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
  

  if (!session) return <div>Login first</div>;
  if (loading) return <p>Loading characters...</p>;

  const createChat = async (characterId: string) => {
    const userId = session?.user?.id;
    try {
      const response = await fetch(`/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterId }),
      });

      const data = await response.json(); // ✅ Await response.json()

      if (response.ok) {
        alert("Chat created, wait for redirecting");
        await fetchUserChats({userID: userId})
        router.push(`/dashboard/my-chats/${data._id}`);
      } else {
        if (data.error === "Chat already exists") {
          alert("Chat already exists, wait for redirecting");
          await fetchUserChats({userID: userId})
          router.push(`/dashboard/my-chats/${data.chatId}`); // ✅ Redirect to existing chat
        } else {
          alert(data.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    }
  };

  return (
    
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
      Explore AI Assistants
    </motion.h1>

    {/* Character Grid */}
    <div className="relative z-10 flex-1 mt-6 overflow-y-auto overflow-x-hidden w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 z-10">
      {characters.map((char) => (
        <div
        key={char._id}
        onClick={() => createChat(char._id)}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-4 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={char.profilePicture}
            alt={char.name}
            className="w-full h-80 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
          />
        </div>

        <h2 className="text-xl font-semibold text-white mt-3">
          {char.name}
        </h2>
        <p className="text-gray-300 line-clamp-3 tolltip">{char.description}</p>
      </div>
      ))}

    </div>
    </div>
    
  </div>
  );
};

export default ExplorePage;
