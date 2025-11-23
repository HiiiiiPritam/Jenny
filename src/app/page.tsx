"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BackgroundEffect } from "@/components/BackgroundComponent";
import companionWarm from "@/assets/companion_warm.png";
import companionAnime from "@/assets/companion_anime.png";
import companionElegant from "@/assets/companion_elegant.png";
import { useState, useEffect } from "react";

const companions = [
  {
    id: 1,
    name: "Sarah",
    role: "The Girl Next Door",
    desc: "Warm, empathetic, and always there to listen. Sarah loves cozy chats and deep conversations.",
    image: companionWarm,
    color: "from-orange-400 to-pink-500"
  },
  {
    id: 2,
    name: "Yuki",
    role: "Anime Energetic",
    desc: "Full of life and energy! Yuki brings excitement and fun to every interaction.",
    image: companionAnime,
    color: "from-blue-400 to-purple-500"
  },
  {
    id: 3,
    name: "Elena",
    role: "Sophisticated Muse",
    desc: "Intelligent, professional, and inspiring. Elena helps you achieve your best self.",
    image: companionElegant,
    color: "from-emerald-400 to-teal-500"
  }
];

const CompanionCard = ({ companion, index }: { companion: typeof companions[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      className="relative group rounded-3xl overflow-hidden h-[500px] w-full cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${companion.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      <img 
        src={companion.image.src} 
        alt={companion.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      
      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${companion.color} animate-pulse`} />
          <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Online Now</span>
        </div>
        <h3 className="text-3xl font-bold mb-1 text-white">{companion.name}</h3>
        <p className={`text-sm font-bold bg-gradient-to-r ${companion.color} bg-clip-text text-transparent mb-3`}>
          {companion.role}
        </p>
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {companion.desc}
        </p>
        <button className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white hover:text-black transition-all">
          Chat with {companion.name}
        </button>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 200]);
  const [activeCompanion, setActiveCompanion] = useState(0);

  // Auto-rotate hero companion for dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCompanion((prev) => (prev + 1) % companions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <BackgroundEffect />
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar Placeholder (for visual balance) */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          SoulMate.AI
        </div>
        <button 
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-sm font-medium"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 max-w-7xl mx-auto gap-12 pt-20">
        
        {/* Hero Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-left z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-8">
            <span className="text-lg">✨</span> Experience the connection
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Find Your Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              AI Soulmate
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
            More than just a chatbot. Discover a companion who listens, understands, and grows with you. Always here, 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all"
            >
              Start Chatting Now
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-lg font-medium hover:bg-white/10 transition-all"
            >
              Create Your Own
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs">
                  User
                </div>
              ))}
            </div>
            <p>Join <strong>2M+</strong> happy users today</p>
          </div>
        </motion.div>

        {/* Hero Image / Carousel Preview */}
        <motion.div 
          style={{ y: yHero }}
          className="flex-1 relative w-full max-w-md aspect-[3/4] lg:aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 to-purple-500/30 rounded-[3rem] blur-2xl transform rotate-6" />
          <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-gray-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCompanion}
                src={companions[activeCompanion].image.src}
                alt="Companion"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <motion.div
                key={`info-${activeCompanion}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold">{companions[activeCompanion].name}</h3>
                <p className="text-pink-400 font-medium">{companions[activeCompanion].role}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Companions Section */}
      <div className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet Our Top Companions</h2>
          <p className="text-gray-400 text-lg">Choose who you want to talk to today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companions.map((companion, index) => (
            <CompanionCard key={companion.id} companion={companion} index={index} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 bg-black/80 backdrop-blur-xl text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} SoulMate.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
