"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import sophia from "@/assets/sophia.png";
import chatImage from "@/assets/chat.png";  // Example image for in-chat feature
import imageGen from "@/assets/genimg2.png"; // Example image for AI image generation
import customAI from "@/assets/comp1.png"; // Example image for custom AI creation

export default function LandingPage() {
  const router = useRouter();

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
          Your AI Companion 🤖
        </h1>
        <p className="text-lg text-gray-300 mt-3 max-w-xl mx-auto">
          Intelligent AI assistants ready to help, learn, and engage with you professionally.
        </p>

        {/* AI Character Image */}
        <motion.img
          src={sophia.src}
          alt="AI Assistant"
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
            onClick={() => router.push("/dashboard")}
          >
            Start Chatting 💬
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-darkPurple text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all hover:bg-purple-700"
            onClick={() => router.push("/dashboard")}
          >
            Create AI Assistant 🛠️
          </motion.button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="relative w-full max-w-6xl mt-20 space-y-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Discover What We Offer ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-6 px-4">
          {/* Feature: AI Chat */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 text-center h-max"
          >
            <img src={chatImage.src} alt="Chat Feature" className="w-full rounded-lg mb-4 hover:scale-105 transition-transform ease-in-out" />
            <h3 className="text-xl font-semibold">AI-Powered Chat</h3>
            <p className="text-gray-300 text-sm mt-2">
              Engage in real-time, intelligent conversations with your AI partner.
            </p>
          </motion.div>

          {/* Feature: Image Generation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 text-center h-max"
          >
            <img src={imageGen.src} alt="Image Generation" className="w-full rounded-lg mb-4 hover:scale-105 transition-transform ease-in-out" />
            <h3 className="text-xl font-semibold">AI Image Generation</h3>
            <p className="text-gray-300 text-sm mt-2">
              Generate stunning AI-powered images based on text or existing images.
            </p>
          </motion.div>

          {/* Feature: Custom AI Characters */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 text-center h-max"
          >
            <img src={customAI.src} alt="Custom AI" className="w-full rounded-lg mb-4 hover:scale-105 transition-transform ease-in-out" />
            <h3 className="text-xl font-semibold">Create Your AI Assistant</h3>
            <p className="text-gray-300 text-sm mt-2">
              Customize AI assistants with unique personalities and professional communication styles.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
