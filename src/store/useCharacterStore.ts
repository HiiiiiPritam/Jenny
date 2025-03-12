import { create } from "zustand";

// Define Character Type
export interface Character {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdBy: string;
  ethnicity?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  skinTone?: string;
  faceShape?: string;
  facialFeatures?: Record<string, any>;
  bodyMeasurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
    height?: number;
    weight?: number;
  };
  age?: number;
  personality?: Record<string, any>;
  personalityTraits?: string[];
  relationshipType?: string;
  imagePrompt?: string;
  voiceModel?: string;
  basePersonalityPrompt?: string;
  baseImagePrompt?: string;
  hobbies?: string[];
  favoriteThings?: string[];
  backgroundStory?: string;
  style?: string;
  preferences?: Record<string, any>;
  virtualPersona?: string;
  createdAt: string;
  updatedAt: string;
  profilePicture?:string;
}

// Zustand Store
interface CharacterStore {
  characters: Character[]; // Store all characters
  currentCharacter: Character | null; // Track selected character
  fetchCharacters: () => Promise<void>; // Fetch all characters for user
  setCurrentCharacter: (character: Character) => void; // Set active character
}

// Zustand store definition
const useCharacterStore = create<CharacterStore>((set) => ({
  characters: [],
  currentCharacter: null,

  // Fetch Characters from API
  fetchCharacters: async () => {
    try {
      const res = await fetch(`/api/characters`);
      if (!res.ok) throw new Error("Failed to fetch characters");
      
      const data = await res.json();
      set({ characters: data });
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  },

  // Set Current Character
  setCurrentCharacter: (character) => set({ currentCharacter: character }),
}));

export default useCharacterStore;
