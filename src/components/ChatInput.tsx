"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import useSpeechToText from "../hooks/useSpeechToText";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

interface ChatInputProps {
  onSend: (userMessage: string, isImage: boolean, isVoiceEnabled: boolean) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isTyping }) => {
  const [input, setInput] = useState<string>("");
  const [generateImage, setGenerateImage] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false); // Default to false as requested
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [visionOutput, setVisionOutput] = useState<string>("");
  const { toast, showToast, hideToast } = useToast();

  // Speech-to-Text hook
  const { isListening, transcribedText, startListening, stopListening } =
    useSpeechToText((transcription: string) => {
      if (transcription.trim()) {
        setInput(transcription);
        onSend(transcription, generateImage, isVoiceEnabled);
      }
    });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);
    try {
      // Here you would typically upload the image to a service
      // For now, we'll simulate analysis or just use the local URL
      // In a real app, you'd want to upload to S3/Cloudinary etc.
      
      // Simulating analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For this demo, we'll just say we analyzed it
      setVisionOutput("Image uploaded successfully. (Mock analysis)");
      showToast("Image analyzed successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      let combinedInput = input;
      if (visionOutput !== "" && visionOutput !== "No description available") {
        combinedInput = `This is the description of a photo, answer accordingly: ${visionOutput}, User ask: ${input}`;
      }
      console.log("Combined Input:", combinedInput);
      onSend(combinedInput, generateImage, isVoiceEnabled);
      setInput("");
      setGenerateImage(false);
      setVisionOutput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.div 
        className="p-4 bg-gradient-to-r from-purple-900/30 to-black/50 backdrop-blur-sm border-t border-purple-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Vision Output Display */}
        {visionOutput && (
          <div className="mb-2 p-2 bg-blue-900/30 rounded text-xs text-blue-200 flex justify-between items-center">
            <span>{visionOutput}</span>
            <button onClick={() => setVisionOutput("")} className="text-blue-400 hover:text-white">×</button>
          </div>
        )}
        
        {/* Main Input Area */}
        <div className="flex flex-col md:flex-row items-end gap-3">
          <div className="flex-1 relative w-full">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className={`w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 resize-none transition-all duration-200 ${
                isImageUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Type a message..."
              disabled={isImageUploading}
              rows={1}
              style={{
                minHeight: '52px',
                maxHeight: '120px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#8b5cf6 transparent'
              }}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {input.length}/500
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto justify-between md:justify-start overflow-x-auto pb-1 md:pb-0">
            <div className="flex gap-2">
              {/* Image Upload */}
              <label className={`relative group cursor-pointer flex-shrink-0 ${
                isImageUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isImageUploading}
                  className="hidden"
                />
                <div className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-200 border border-gray-600 group-hover:border-purple-500 group-hover:text-purple-400 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </label>
              
              {/* Voice Response Toggle */}
              <motion.button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                disabled={isImageUploading}
                className={`p-3 rounded-xl transition-all duration-200 border flex-shrink-0 ${
                  isVoiceEnabled 
                    ? "bg-pink-600 hover:bg-pink-700 border-pink-500" 
                    : "bg-gray-700 hover:bg-gray-600 border-gray-600"
                } text-white ${
                  isImageUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isVoiceEnabled ? "Disable Voice Response" : "Enable Voice Response"}
              >
                {isVoiceEnabled ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </motion.button>

              {/* Speech to Text */}
              <motion.button
                onClick={isListening ? stopListening : startListening}
                disabled={isImageUploading}
                className={`p-3 rounded-xl transition-all duration-200 border flex-shrink-0 ${
                  isListening 
                    ? "bg-red-600 hover:bg-red-700 border-red-500" 
                    : "bg-green-600 hover:bg-green-700 border-green-500"
                } text-white ${
                  isImageUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.button>
              
              {/* Image Generation Toggle */}
              <motion.button
                onClick={() => setGenerateImage(!generateImage)}
                disabled={isImageUploading}
                className={`p-3 rounded-xl transition-all duration-200 border flex-shrink-0 ${
                  generateImage 
                    ? "bg-purple-600 hover:bg-purple-700 border-purple-500" 
                    : "bg-gray-700 hover:bg-gray-600 border-gray-600"
                } text-white ${
                  isImageUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </div>
            
            {/* Send Button */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isImageUploading}
              className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                input.trim() && !isImageUploading
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-500" 
                  : "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
              } text-white border`}
              whileHover={input.trim() && !isImageUploading ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isImageUploading ? { scale: 0.95 } : {}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Status Indicators */}
        {isImageUploading && (
          <motion.div 
            className="mt-3 flex items-center gap-2 text-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Analyzing image...</span>
          </motion.div>
        )}
        
        {generateImage && (
          <motion.div 
            className="mt-2 text-purple-400 text-sm flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image generation enabled
          </motion.div>
        )}
      </motion.div>
      
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

export default ChatInput;
