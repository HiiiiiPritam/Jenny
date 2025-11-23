// /api/chat 
import mongoose, { Schema, Document, Types } from "mongoose";

// Define Message SubSchema
const MessageSchema = new Schema(
  {
    sender: { type: String, enum: ["user", "bot"], required: true }, // Who sent the message
    text: { type: String }, // Text content
    isImage: { type: Boolean, default: false }, // Is this an AI-generated image?
    isVoice: { type: Boolean, default: false }, // Is this a voice message?
    imageURL: { type: String, default: null }, // If it's an image, store the URL
    voiceURL: { type: String, default: null }, // If it's a voice message, store the URL
    timestamp: { type: Date, default: Date.now }, // When the message was sent
  },
  { _id: false } // Prevents creating separate IDs for messages
);

// Define Chat Schema
export interface IChat extends Document {
  user: Types.ObjectId; // Reference to User
  character: Types.ObjectId; // Reference to Character
  messages: typeof MessageSchema[];
  lastProactiveMessageSentAt?: Date;
  lastUserMessageAt?: Date;
  nextProactiveMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who owns the chat
    character: { type: Schema.Types.ObjectId, ref: "Character", required: true }, // AI Character
  messages: [MessageSchema], // Array of messages
    lastProactiveMessageSentAt: { type: Date }, // Timestamp of last proactive message
    lastUserMessageAt: { type: Date, default: Date.now }, // When the user last messaged
    nextProactiveMessageAt: { type: Date }, // Scheduled time for the next proactive message
  },
  { timestamps: true }
);

// Export model
export default mongoose.models?.Chat || mongoose.model<IChat>("Chat", ChatSchema);
