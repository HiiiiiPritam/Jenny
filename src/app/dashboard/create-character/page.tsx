"use client";

import { useState } from "react";
import {
  generateImagePrompt,
  generatePersonalityPrompt,
} from "@/services/characterServices";
import { generateImage } from "@/services/generativeAIService";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft, FiStar, FiImage, FiSave, FiUser } from "react-icons/fi";
import useCharacterStore from "@/store/useCharacterStore";

const CreateCharacter = () => {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: "",
    description: "",
    isPublic: true,
    ethnicity: "Caucasian",
    hairColor: "Blonde",
    hairStyle: "Long and Wavy",
    eyeColor: "Blue",
    skinTone: "Fair",
    faceShape: "Oval",
    facialFeatures: { freckles: false, dimples: false },
    physicalAttributes: { height: 165, build: "average" },
    age: 22,
    personality: { openness: 8, conscientiousness: 6, extraversion: 9, agreeableness: 7, neuroticism: 3 },
    personalityTraits: [],
    assistantRole: "companion",
    imagePrompt: "",
    voiceModel: "Soft and friendly AI voice",
    basePersonalityPrompt: "",
    baseImagePrompt: "",
    hobbies: [],
    favoriteThings: [],
    backgroundStory: "They have an intriguing past, shaping their personality.",
    style: "Modern and futuristic",
    preferences: { likes: [], dislikes: [] },
    profilePicture: "",
  });

  const { fetchCharacters } = useCharacterStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (category: string, key: string, value: any) => {
    setCharacter((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as object),
        [key]: value,
      },
    }));
  };

  const handleArrayChange = (category: string, value: string) => {
    setCharacter((prev) => ({
      ...prev,
      [category]: value.split(",").map(item => item.trim()).filter(Boolean),
    }));
  };

  const handleFacialFeatureChange = (name: string, checked: boolean) => {
    setCharacter((prev) => ({
      ...prev,
      facialFeatures: { ...prev.facialFeatures, [name]: checked },
    }));
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const prompt = generateImagePrompt(character);
      const imageUrl = await generateImage({ userMessage: prompt });
      if (imageUrl) {
        setCharacter((prev) => ({
          ...prev,
          profilePicture: imageUrl,
          imagePrompt: prompt,
        }));
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!character.profilePicture) {
      alert("Please generate a profile picture first!");
      return;
    }

    setIsSubmitting(true);
    try {
      const physicalAttrs = character.physicalAttributes || {};
      const physicalText = `height: ${physicalAttrs.height}cm, build: ${physicalAttrs.build}`;
      
      const updatedCharacter = {
        ...character,
        basePersonalityPrompt: generatePersonalityPrompt(character),
        baseImagePrompt: character.baseImagePrompt || `A professional portrait of ${character.name}, a ${character.age}-year-old person of ${character.ethnicity} origin with ${character.skinTone} skin tone and ${character.hairColor} ${character.hairStyle} hair, ${character.eyeColor} eyes, and a ${character.faceShape} face. Physical build: ${physicalText}.`,
        createdBy: session?.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/characters/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCharacter),
      });

      if (!response.ok) throw new Error("Failed to create character");
      
      await fetchCharacters();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating character:", error);
      alert("Failed to create character. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user.id) return <div className="flex items-center justify-center h-full text-white/50">Loading session...</div>;

  const steps = [
    { id: 1, title: "Identity", icon: <FiUser /> },
    { id: 2, title: "Appearance", icon: <FiStar /> },
    { id: 3, title: "Personality", icon: <FiStar /> },
    { id: 4, title: "Visuals", icon: <FiImage /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 pt-24 pb-8 text-white min-h-full">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Create AI Companion
        </h1>
        <p className="text-gray-400">Design your perfect AI partner with unique traits and personality.</p>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                step === s.id 
                  ? "bg-pink-600 shadow-lg shadow-pink-600/40 text-white" 
                  : step > s.id 
                    ? "bg-green-600 text-white" 
                    : "bg-[#1a1a1a] text-gray-500 border border-white/5"
              }`}
            >
              {s.icon}
            </button>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === s.id ? "text-pink-500" : "text-gray-500"}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Companion Name</label>
                  <input
                    type="text"
                    name="name"
                    value={character.name}
                    onChange={handleChange}
                    placeholder="e.g. Luna"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Role</label>
                  <select
                    name="assistantRole"
                    value={character.assistantRole}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-pink-500 transition-all outline-none"
                  >
                    <option value="companion">Friendly Companion</option>
                    <option value="mentor">Mentor & Guide</option>
                    <option value="tutor">Learning Tutor</option>
                    <option value="consultant">Professional Consultant</option>
                    <option value="assistant">Personal Assistant</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Short Description</label>
                <textarea
                  name="description"
                  value={character.description}
                  onChange={handleChange}
                  placeholder="What makes them special?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-pink-500 transition-all outline-none resize-none"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Ethnicity</label>
                  <select name="ethnicity" value={character.ethnicity} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
                    <option value="Anime">Anime Style</option>
                    <option value="Caucasian">Caucasian</option>
                    <option value="Asian">Asian</option>
                    <option value="Indian">Indian</option>
                    <option value="African">African</option>
                    <option value="Hispanic">Hispanic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Skin Tone</label>
                  <select name="skinTone" value={character.skinTone} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
                    <option value="Fair">Fair</option>
                    <option value="Light">Light</option>
                    <option value="Tan">Tan</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Hair Color</label>
                  <select name="hairColor" value={character.hairColor} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
                    <option value="Black">Black</option>
                    <option value="Brown">Brown</option>
                    <option value="Blonde">Blonde</option>
                    <option value="White">White</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Hair Style</label>
                  <select name="hairStyle" value={character.hairStyle} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
                    <option value="Short and Straight">Short & Straight</option>
                    <option value="Long and Wavy">Long & Wavy</option>
                    <option value="Ponytail">Ponytail</option>
                    <option value="Bob Cut">Bob Cut</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${character.facialFeatures.freckles ? "bg-pink-600 border-pink-600" : "border-white/10 bg-white/5"}`}
                    onClick={() => handleFacialFeatureChange("freckles", !character.facialFeatures.freckles)}>
                    {character.facialFeatures.freckles && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-300">Freckles</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${character.facialFeatures.dimples ? "bg-pink-600 border-pink-600" : "border-white/10 bg-white/5"}`}
                    onClick={() => handleFacialFeatureChange("dimples", !character.facialFeatures.dimples)}>
                    {character.facialFeatures.dimples && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-300">Dimples</span>
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Personality Traits (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Caring, Sarcastic, Highly Intelligent"
                  onChange={(e) => handleArrayChange("personalityTraits", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Hobbies & Interests</label>
                <input
                  type="text"
                  placeholder="e.g. Reading, Hiking, Gaming"
                  onChange={(e) => handleArrayChange("hobbies", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Background Story</label>
                <textarea
                  name="backgroundStory"
                  value={character.backgroundStory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative group">
                <div className={`w-48 h-48 rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${character.profilePicture ? "border-pink-500 shadow-xl shadow-pink-500/20" : "border-white/10 bg-white/5"}`}>
                  {character.profilePicture ? (
                    <img src={character.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <FiUser size={64} opacity={0.3} />
                    </div>
                  )}
                </div>
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3 max-w-sm text-center">
                <h3 className="text-xl font-bold">Generated Identity</h3>
                <p className="text-sm text-gray-400">
                  {character.profilePicture 
                    ? "Your AI companion's appearance is ready. You can re-generate if you want a different look."
                    : "Generate an AI avatar based on the attributes you've defined."}
                </p>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  isGeneratingImage 
                    ? "bg-gray-800 text-gray-500" 
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                <FiStar />
                {isGeneratingImage ? "Generating Presence..." : character.profilePicture ? "Re-generate Avatar" : "Generate Avatar"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-white/5"
          }`}
        >
          <FiChevronLeft /> Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !character.name.trim()}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            Continue <FiChevronRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!character.profilePicture || isSubmitting}
            className="flex items-center gap-2 px-10 py-4 font-bold rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-pink-600/20"
          >
            <FiSave />
            {isSubmitting ? "Bringing to life..." : "Create Companion"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateCharacter;
