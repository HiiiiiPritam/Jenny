"use client";
import { motion } from "framer-motion";


/* Background Animation Component */
export function BackgroundEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-40 h-40 bg-matteRed opacity-30 rounded-full blur-3xl"
        animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-28 h-28 bg-darkPurple opacity-40 rounded-full blur-3xl"
        animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}