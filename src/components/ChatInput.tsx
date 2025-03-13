"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import useSpeechToText from "../hooks/useSpeechToText";

interface ChatInputProps {
  onSend: (userMessage: string, isImage: boolean) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isTyping }) => {
  const [input, setInput] = useState<string>("");
  const [generateImage, setGenerateImage] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [visionOutput, setVisionOutput] = useState<string>("");

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
        alert("No description available, please try again with a different image or wait for some time and try again.");
        setVisionOutput("");
        setIsImageUploading(false);
        return
      }
      setVisionOutput(description);
      alert("Image uploaded successfully, now give your input");
      // Update input field to combine vision output with user's text
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
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
      setInput(""); // Clear input after sending
      setGenerateImage(false);
      setVisionOutput("");
    }
    // console.log(visionOutput);
  };

  useEffect(() => {
    if (transcribedText && !isListening) {
      setInput(transcribedText);
    }
  }, [transcribedText, isListening]);

  return (
    <div className="relative z-10 flex flex-wrap w-full max-w-[800px] items-center gap-2 p-4">
      
      {/* Text input field */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded-md min-w-[150px] sm:min-w-[250px] max-w-full text-black"
        placeholder="Type a message or use the mic..."
        disabled={isImageUploading || isTyping}
      />
      {/* Speech-to-Text Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isImageUploading || isTyping}
        className={`px-4 py-2 rounded-md ${
          isListening ? "bg-red-600" : "bg-green-600"
        } text-white ${
          isImageUploading || isTyping ? "pointer-events-none bg-gray-500" : ""
        } hover:opacity-80 min-w-[80px]`}
      >
        {isListening ? "Stop" : "Speak"}
      </button>
      {/* Checkbox for image generation flag */}
      <label className="flex text-white items-center gap-2">
        <input
          type="checkbox"
          checked={generateImage}
          onChange={() => setGenerateImage(!generateImage)}
          disabled={isImageUploading || isTyping}
        />
        Image
      </label>
      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={isImageUploading || isTyping}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[80px] ${
          isImageUploading || isTyping ? "pointer-events-none bg-gray-500" : ""
        }`}
      >
        Send
      </button>
      {/* File input for image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isImageUploading || isTyping}
        className="cursor-pointer"
      />
      {/* Uploading status */}
      {isImageUploading && (
        <p className="text-yellow-300">Uploading and analyzing image...</p>
      )}
    </div>
  );
};

export default ChatInput;
