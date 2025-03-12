"use client";
import { motion } from "framer-motion";
import sophia from '@/assets/sophia.png'
import { useRouter } from "next/navigation";
import { BackgroundEffect } from "@/components/BackgroundComponent";


export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple to-black opacity-60"></div>

      {/* Floating Background Effect */}
      <BackgroundEffect />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative text-center z-10"
      >
        <h1 className="text-5xl font-extrabold text-matteRed drop-shadow-lg">
          Your AI Girlfriend ❤️
        </h1>
        <p className="text-lg text-gray-300 mt-3 max-w-xl mx-auto">
          The perfect companion, always there to chat, understand, and engage with you.
        </p>

        {/* AI Character Image */}
        <motion.img
          src={sophia.src}
          alt="AI Girlfriend"
          className="w-72 mx-auto my-6 rounded-lg shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-matteRed text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all hover:bg-red-700"
            onClick={()=>router.push('/dashboard')}
          >
            Chat Now 💬
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-darkPurple text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all hover:bg-purple-700"
            onClick={()=>router.push('/dashboard')}
          >
            Create Character 🛠️
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


