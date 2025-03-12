"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "next-auth/react";
import { BackgroundEffect } from "@/app/page";
import { motion } from "framer-motion";


const MyChats = () => {
  const { data: session } = useSession();
  const { chats, fetchUserChats } = useChatStore();
  const router = useRouter();

  if (!session) return <div>User not present</div>;

  // Load all chats on mount
  useEffect(() => {
    fetchUserChats({ userID: session?.user?.id });
  }, []);

  return (
    <div className="relative h-[calc(100dvh-4rem)] p-6 inset-0 bg-gradient-to-br from-darkPurple to-black overflow-auto">
    {/* Background Animated Effects */}
    <BackgroundEffect />

    {/* Heading with Fade-in Animation */}
    <motion.h2
      className="text-2xl font-bold mb-4 text-matteRed text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      My Chats
    </motion.h2>

    {chats.length === 0 ? (
      <motion.p
        className="text-gray-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        You have no chats yet.
      </motion.p>
    ) : (
      <motion.ul
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {chats.map((chat) => (
          <motion.li
            key={chat._id}
            onClick={() => router.push(`/dashboard/my-chats/${chat._id}`)}
            className="cursor-pointer bg-[#442268] hover:bg-purple-700 transition-all p-3 rounded-lg flex justify-between items-center shadow-md relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Floating Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-matteRed opacity-20 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="h-10 flex gap-3 items-center relative z-10">
              <motion.img
                className="max-h-full rounded-full border-2 border-matteRed"
                src={chat.character.profilePicture}
                alt="character image"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <p className="font-semibold text-white">{chat.character.name}</p>
            </div>
            <motion.span
              className="text-gray-300 relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.li>
        ))}
      </motion.ul>
    )}
  </div>
  );
};

export default MyChats;
