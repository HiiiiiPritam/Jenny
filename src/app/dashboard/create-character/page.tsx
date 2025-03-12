"use client";

import { useState } from "react";
import { generateImagePrompt, generatePersonalityPrompt } from "@/services/characterServices";
import { generateImage } from "@/services/generativeAIService";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { createCharacter } from "@/services/characterService"; 
import './style.css'

const CreateCharacter = () => {
  const [character, setCharacter] = useState({
    // Basic Information
    name: "",
    description: "",
    isPublic: true,
    createdBy: "", // Example user ID (replace dynamically)

    // Appearance
    ethnicity: "Caucasian",
    hairColor: "Blonde",
    hairStyle: "Long and Wavy",
    eyeColor: "Blue",
    skinTone: "Fair",
    faceShape: "Oval",
    facialFeatures: { freckles: false, dimples: false },

    // Body Measurements
    bodyMeasurements: {
      bust: 34,
      waist: 26,
      hips: 36,
      height: 165,
      weight: 55,
    },

    age: 22,

    // Personality
    personality: {
      openness: 8,
      conscientiousness: 6,
      extraversion: 9,
      agreeableness: 7,
      neuroticism: 3,
    },
    personalityTraits: ["Cheerful", "Witty", "Curious"],
    relationshipType: "friend",

    // AI Attributes
    imagePrompt: "",
    voiceModel: "Soft and friendly AI voice",
    basePersonalityPrompt: "",
    baseImagePrompt: "",

    // Interests & Preferences
    hobbies: ["Reading", "Dancing", "Exploring new cultures"],
    favoriteThings: ["Space exploration", "AI advancements", "Good humor"],
    backgroundStory: "Luna is an advanced AI developed to assist and entertain users with her witty personality.",
    style: "Modern and futuristic",
    preferences: { likes: ["Technology", "Art"], dislikes: ["Rudeness", "Ignorance"] },
    virtualPersona: "A supportive and engaging AI friend",

    // Media
    profilePicture: "",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const {data : session} = useSession();
  const router = useRouter();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const createCharacter = async(updatedCharacter : any)=>{

    try {
      const response = await fetch(`/api/characters/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCharacter),
        }
      )
  
      const data = await response.json();
    } catch (error) {
      console.log(error);
      }
    
  }

  // Handle checkbox changes for facial features
  const handleFacialFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCharacter((prev) => ({
      ...prev,
      facialFeatures: { ...prev.facialFeatures, [name]: checked },
    }));
  };

  // Generate Profile Picture
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const prompt = generateImagePrompt(character);
      console.log(prompt);
      
      const imageUrl = await generateImage({userMessage:prompt});
      if(imageUrl)
      setCharacter((prev) => ({ ...prev, profilePicture: imageUrl, imagePrompt: prompt }));
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setIsGeneratingImage(false);
  };

  // Create Character
  const handleSubmit = async () => {
    if (!character.profilePicture) {
      alert("Please generate a profile picture first!");
      return;
    }

    // Ensure base personality & image prompts are meaningful
    const updatedCharacter = {
      ...character,
      basePersonalityPrompt:
        generatePersonalityPrompt(character),
      baseImagePrompt:
        character.baseImagePrompt ||
        `A highly detailed portrait of ${character.name}, a ${character.age}-year-old individual of ${character.ethnicity} origin with ${character.skinTone} skin tone and ${character.hairColor} ${character.hairStyle} hair, ${character.eyeColor} eyes, and a ${character.faceShape} face. They are wearing ${character.style} clothing.`,
      createdBy:session?.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      await createCharacter(updatedCharacter);
      alert("Character created successfully!");
    } catch (error) {
      console.error("Error creating character:", error);
    }
    setIsSubmitting(false);
    router.push('/dashboard/')
  };

  if(!session?.user.id)return <div>No user present</div>

  return (
    <div className="p-6 relative z-10 max-h-[calc(100dvh-4rem)] overflow-auto inset-0 bg-gradient-to-br text-[#753a6d] from-darkPurple to-black max-w-2xl mx-auto">
  <h2 className="text-2xl text-matteRed font-bold mb-4">Create a New Character</h2>

  {/* Name */}
  <div className="mb-4">
    <label className="block font-semibold">Name:</label>
    <input
      type="text"
      name="name"
      value={character.name}
      onChange={handleChange}
      className="w-full border rounded p-2"
    />
  </div>

  {/* Description */}
  <div className="mb-4">
    <label className="block font-semibold">Description:</label>
    <textarea
      name="description"
      value={character.description}
      onChange={handleChange}
      className="w-full border rounded p-2"
    ></textarea>
  </div>

  {/* Ethnicity & Skin Tone */}
  <div className="mb-4">
    <label className="block font-semibold">Ethnicity:</label>
    <select name="ethnicity" value={character.ethnicity} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Caucasian">Caucasian</option>
      <option value="African">African</option>
      <option value="Asian">Asian</option>
      <option value="Hispanic">Hispanic</option>
      <option value="Mixed">Mixed</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block font-semibold">Skin Tone:</label>
    <select name="skinTone" value={character.skinTone} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Fair">Fair</option>
      <option value="Light">Light</option>
      <option value="Tan">Tan</option>
      <option value="Olive">Olive</option>
      <option value="Dark">Dark</option>
    </select>
  </div>

  {/* Hair & Eye Color */}
  <div className="mb-4">
    <label className="block font-semibold">Hair Color:</label>
    <select name="hairColor" value={character.hairColor} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Black">Black</option>
      <option value="Brown">Brown</option>
      <option value="Blonde">Blonde</option>
      <option value="Red">Red</option>
      <option value="Gray">Gray</option>
      <option value="White">White</option>
      <option value="Dyed">Dyed (e.g., blue, pink, purple)</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block font-semibold">Hair Style:</label>
    <select name="hairStyle" value={character.hairStyle} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Short and Straight">Short and Straight</option>
      <option value="Long and Wavy">Long and Wavy</option>
      <option value="Curly">Curly</option>
      <option value="Bald">Bald</option>
      <option value="Mohawk">Mohawk</option>
      <option value="Braided">Braided</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block font-semibold">Eye Color:</label>
    <select name="eyeColor" value={character.eyeColor} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Brown">Brown</option>
      <option value="Blue">Blue</option>
      <option value="Green">Green</option>
      <option value="Hazel">Hazel</option>
      <option value="Gray">Gray</option>
      <option value="Amber">Amber</option>
      <option value="Violet">Violet</option>
    </select>
  </div>

  {/* Facial Features */}
  <div className="mb-4">
    <label className="block font-semibold">Facial Features:</label>
    <label>
      <input
        type="checkbox"
        name="freckles"
        checked={character.facialFeatures.freckles}
        onChange={handleFacialFeatureChange}
      />{" "}
      Freckles
    </label>
    <label>
      <input
        type="checkbox"
        name="dimples"
        checked={character.facialFeatures.dimples}
        onChange={handleFacialFeatureChange}
      />{" "}
      Dimples
    </label>
  </div>

  {/* Body Measurements */}
  <div className="mb-4">
    <label className="block font-semibold">Body Measurements:</label>
    <div className="flex space-x-2">
      <input
        type="number"
        name="height"
        value={character.bodyMeasurements.height}
        onChange={handleChange}
        placeholder="Height (cm)"
        className="border rounded p-2 w-1/3"
      />
      <input
        type="number"
        name="weight"
        value={character.bodyMeasurements.weight}
        onChange={handleChange}
        placeholder="Weight (kg)"
        className="border rounded p-2 w-1/3"
      />
    </div>
  </div>

  {/* Style & Clothing */}
  <div className="mb-4">
    <label className="block font-semibold">Style:</label>
    <select name="style" value={character.style} onChange={handleChange} className="w-full border rounded p-2">
      <option value="Casual">Casual</option>
      <option value="Formal">Formal</option>
      <option value="Streetwear">Streetwear</option>
      <option value="Punk">Punk</option>
      <option value="Modern and futuristic">Modern and futuristic</option>
      <option value="Gothic">Gothic</option>
      <option value="Fantasy">Fantasy</option>
    </select>
  </div>

    {/* relationship Type */}
    <div className="mb-4">
    <label className="block font-semibold">Reationship:</label>
    <select name="relationshipType" value={character.relationshipType} onChange={handleChange} className="w-full border rounded p-2">
      <option value="friend">Friend</option>
      <option value="horny girlfriend">girlfriend</option>
      <option value="stepsister who lusts for the user">step sister</option>
      <option value="horny neighbour">Neighbour</option>
      <option value="mysterious stranger">Stranger</option>
      <option value="Fantasy world character">Fantasy</option>
    </select>
  </div>

  {/* Profile Picture */}
  <div className="mb-4">
    <label className="block font-semibold">Profile Picture:</label>
    {character.profilePicture ? (
      <img src={character.profilePicture} alt="Profile" className="w-32 h-32 rounded-lg" />
    ) : (
      <p className="text-gray-500">No image generated.</p>
    )}
    <button
      onClick={handleGenerateImage}
      disabled={isGeneratingImage}
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      {isGeneratingImage ? "Generating..." : "Generate Image"}
    </button>
  </div>

  {/* Create Character Button */}
  <button
    onClick={handleSubmit}
    disabled={!character.profilePicture || isSubmitting}
    className="bg-green-500 text-white px-6 py-2 rounded-lg"
  >
    {isSubmitting ? "Creating..." : "Create Character"}
  </button>
</div>

  );
};

export default CreateCharacter;
