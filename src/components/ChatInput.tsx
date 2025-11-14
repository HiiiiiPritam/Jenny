"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import useSpeechToText from "../hooks/useSpeechToText";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

interface ChatInputProps {
  onSend: (userMessage: string, isImage: boolean) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isTyping }) => {
  const [input, setInput] = useState<string>("");
  const [generateImage, setGenerateImage] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [visionOutput, setVisionOutput] = useState<string>("");
  const { toast, showToast, hideToast } = useToast();

  // Speech-to-Text hook
  const { isListening, transcribedText, startListening, stopListening } =
    useSpeechToText((transcription: string) => {
      if (transcription.trim()) {
        setInput(transcription);
        onSend(transcription, generateImage);
      }
    });

  // Handle file upload and convert to base64
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImageUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        analyzeImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Call the vision API to analyze the image
  const analyzeImage = async (base64Image: string) => {
    try {
      const payload = {
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe this image." },
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
        model: "openai",
      };

      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const description =
        data?.choices?.[0]?.message?.content || "No description available";
      if(description == "No description available") {
        showToast("No description available, please try again with a different image.", "error");
        setVisionOutput("");
        setIsImageUploading(false);
        return
      }
      setVisionOutput(description);
      showToast("Image uploaded successfully! You can now send your message.", "success");
      // Update input field to combine vision output with user's text
    } catch (error) {
      showToast("Failed to analyze image. Please try again.", "error");
      console.error("Error analyzing image:", error);
      setVisionOutput("");
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
      onSend(combinedInput, generateImage);
      setInput("");
      setGenerateImage(false);
      setVisionOutput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (transcribedText && !isListening) {
      setInput(transcribedText);
    }
  }, [transcribedText, isListening]);

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
          <motion.div 
            className="mb-3 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-blue-300 text-sm">
              <span className="font-medium">Image analyzed:</span> {visionOutput.substring(0, 100)}...
            </p>
          </motion.div>
        )}
        
        {/* Main Input Area */}
        <div className="flex items-end gap-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 bg-gray-800/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
              disabled={isImageUploading || isTyping}
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
          <div className="flex gap-2">
            {/* Image Upload */}
            <label className={`relative group cursor-pointer ${
              isImageUploading || isTyping ? "opacity-50 cursor-not-allowed" : ""
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isImageUploading || isTyping}
                className="hidden"
              />
              <motion.div
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-200 border border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Upload Image
              </div>
            </label>
            
            {/* Speech to Text */}
            <motion.button
              onClick={isListening ? stopListening : startListening}
              disabled={isImageUploading || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 border ${
                isListening 
                  ? "bg-red-600 hover:bg-red-700 border-red-500" 
                  : "bg-green-600 hover:bg-green-700 border-green-500"
              } text-white ${
                isImageUploading || isTyping ? "opacity-50 cursor-not-allowed" : ""
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
              disabled={isImageUploading || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 border ${
                generateImage 
                  ? "bg-purple-600 hover:bg-purple-700 border-purple-500" 
                  : "bg-gray-700 hover:bg-gray-600 border-gray-600"
              } text-white ${
                isImageUploading || isTyping ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.button>
            
            {/* Send Button */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isImageUploading || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 ${
                input.trim() && !isImageUploading && !isTyping
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-500" 
                  : "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
              } text-white border`}
              whileHover={input.trim() && !isImageUploading && !isTyping ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isImageUploading && !isTyping ? { scale: 0.95 } : {}}
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
