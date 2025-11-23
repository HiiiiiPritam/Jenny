"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character } from "@/store/useCharacterStore";
import useSpeechToText from "@/hooks/useSpeechToText";
import { speak } from "@/utils/tts";

interface CallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSendMessage: (message: string) => Promise<string | void>; // Returns bot reply
}

const CallOverlay: React.FC<CallOverlayProps> = ({
  isOpen,
  onClose,
  character,
  onSendMessage,
}) => {
  const [status, setStatus] = useState<"listening" | "processing" | "speaking">("listening");
  const [transcript, setTranscript] = useState("");
  
  // We need a ref to track if the call is active to prevent loops after closing
  const isCallActive = useRef(isOpen);

  useEffect(() => {
    isCallActive.current = isOpen;
    if (!isOpen) {
        stopListening();
        window.speechSynthesis.cancel();
    } else {
        // Start listening when call opens
        setStatus("listening");
        startListening();
    }
  }, [isOpen]);

  const handleUserSpeech = async (text: string) => {
    if (!isCallActive.current || !text.trim()) return;

    setStatus("processing");
    setTranscript(text);
    stopListening(); // Stop listening while processing

    try {
      const reply = await onSendMessage(text);
      
      if (isCallActive.current && typeof reply === "string" && reply) {
        setStatus("speaking");
        speak(reply, () => {
          // When bot finishes speaking, start listening again
          if (isCallActive.current) {
            setStatus("listening");
            setTranscript(""); // Clear transcript for next turn
            startListening();
          }
        });
      } else {
        // If no reply or error, go back to listening
        setStatus("listening");
        startListening();
      }
    } catch (error) {
      console.error("Call error:", error);
      setStatus("listening");
      startListening();
    }
  };

  const { isListening, startListening, stopListening } = useSpeechToText(handleUserSpeech);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Character Info */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              {/* Pulsing rings based on status */}
              {status === "speaking" && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-500"
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-500"
                    animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                </>
              )}
              
              {status === "listening" && (
                 <motion.div
                 className="absolute inset-0 rounded-full bg-green-500/20"
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
              )}

              <img
                src={character.profilePicture}
                alt={character.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/10 relative z-10"
              />
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-white">{character.name}</h2>
            <p className="text-purple-300 text-lg">
                {status === "listening" && "Listening..."}
                {status === "processing" && "Thinking..."}
                {status === "speaking" && "Speaking..."}
            </p>
          </div>

          {/* Transcript Preview */}
          <div className="h-24 px-8 text-center max-w-2xl">
            <p className="text-gray-400 text-lg italic">
                {transcript && `"${transcript}"`}
            </p>
          </div>

          {/* Controls */}
          <div className="mt-12 flex gap-6">
            {/* Mute/Unmute (Optional, for now just End Call) */}
            
            <motion.button
              onClick={onClose}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallOverlay;
