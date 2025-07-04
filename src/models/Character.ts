import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  // Basic Information
  name: string;
  description?: string;
  isPublic: boolean;
  createdBy?: mongoose.Types.ObjectId;

  // Anatomical & Facial Features
  ethnicity?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  skinTone?: string;
  faceShape?: string;
  facialFeatures?: Record<string, any>;

  // Body Measurements
  bodyMeasurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
    height?: number;
    weight?: number;
  };

  age?: number;

  // Personality & Relationship
  personality?: Record<string, any>;
  personalityTraits?: string[];
  relationshipType?: string;

  // Media Generation Settings
  imagePrompt?: string; // Dynamic image prompt (for extra details)
  voiceModel?: string;

  // New Base Prompts (fixed parts)
  basePersonalityPrompt?: string; // Fixed personality prompt for conversation tone and context
  baseImagePrompt?: string;       // Fixed image prompt for consistent anatomical details

  // Additional Attributes
  hobbies?: string[];
  favoriteThings?: string[];
  backgroundStory?: string;
  style?: string;
  preferences?: Record<string, any>;
  virtualPersona?: string;

  profilePicture?:string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema<ICharacter>(
  {
    // Basic Information
    name: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // Anatomical & Facial Features
    ethnicity: { type: String },
    hairColor: { type: String },
    hairStyle: { type: String },
    eyeColor: { type: String },
    skinTone: { type: String },
    faceShape: { type: String },
    facialFeatures: { type: Schema.Types.Mixed },

    // Body Measurements
    bodyMeasurements: {
      bust: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      height: { type: Number },
      weight: { type: Number },
    },

    age: { type: Number },

    // Personality & Relationship
    personality: { type: Schema.Types.Mixed },
    personalityTraits: { type: [String] },
    relationshipType: { type: String },

    // Media Generation Settings
    imagePrompt: { type: String },
    voiceModel: { type: String },

    // Base Prompts
    basePersonalityPrompt: { type: String },
    baseImagePrompt: { type: String },

    // Additional Attributes
    hobbies: { type: [String] },
    favoriteThings: { type: [String] },
    backgroundStory: { type: String },
    style: { type: String },
    preferences: { type: Schema.Types.Mixed },
    virtualPersona: { type: String },

    profilePicture:{type: String},

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

// Middleware to update updatedAt on each save
CharacterSchema.pre<ICharacter>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models?.Character || mongoose.model<ICharacter>('Character', CharacterSchema);
