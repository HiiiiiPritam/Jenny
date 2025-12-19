"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowLeft, FiHeart, FiCode, FiZap } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { BackgroundEffect } from "@/components/BackgroundComponent";

export default function AboutUs() {
  const router = useRouter();

  const socialLinks = [
    { icon: <FiMail />, href: "mailto:ratsdust4226@gmail.com", label: "Email" },
    { icon: <FiGithub />, href: "https://github.com/HiiiiiPritam", label: "GitHub" },
    { icon: <FiLinkedin />, href: "https://www.linkedin.com/in/pritam-roy-95185328a/", label: "LinkedIn" },
    { icon: <FiInstagram />, href: "https://www.instagram.com/pritam_roy_2023/", label: "Instagram" },
  ];

  return (
    <div className="h-full bg-transparent text-white flex flex-col items-center justify-start px-8 relative overflow-y-auto pt-40 pb-20">
      <BackgroundEffect />
      
      <motion.div
        className="relative z-10 max-w-3xl w-full space-y-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className="text-center space-y-32">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-pink-600/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            Crafted with passion
          </motion.div>
          <h1 className="text-6xl font-bold tracking-tighter mb-4">
            The Vision Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Jenny</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium">
          <br />
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl space-y-4 transition-colors hover:border-pink-500/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 flex items-center justify-center text-pink-500 mb-6">
              <FiZap size={24} />
            </div>
            <h2 className="text-2xl font-bold">The Project</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Our AI Assistant Platform provides professional, helpful, and engaging conversations 
              using state-of-the-art LLMs. Since refactored, it focuses on modularity, clean architecture, 
              and a premium user experience without unnecessary bloat.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl space-y-4 transition-colors hover:border-purple-500/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-500 mb-6">
              <FiCode size={24} />
            </div>
            <h2 className="text-2xl font-bold">The Creator</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Built by Pritam, a Computer Science undergrad driven by the intersection of AI and elegant 
              interfaces. This platform is a testament to the power of modern web technologies 
              like Next.js, Tailwind, and Framer Motion.
              <br />
              <br />
              Okay bro listen up, we all know that most of this is made my AI and i was just clicking "Accept All" like a shameless vibe coder, with every "Accept All" i was losing more and more of my self respect. Just to make it clear, i am not a coder, i am a programmer 🤓.
            </p>
          </motion.div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 text-center space-y-8">
          <h3 className="text-2xl font-bold">Connect with me</h3>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            Always open for collaboration & feedback
          </p>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-pink-500 hover:text-white transition-all mx-auto shadow-2xl"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Return to Dashboard
          </button>
        </div>
      </motion.div>

      <footer className="mt-20 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10">
        Proudly developed in 2024
      </footer>
    </div>
  );
}
