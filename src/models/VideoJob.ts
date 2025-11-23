import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVideoJob extends Document {
  userId: string;
  prompt: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  videoUrl?: string;
  error?: string;
  progress?: number;
  stage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoJobSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    videoUrl: { type: String },
    error: { type: String },
    progress: { type: Number, default: 0 },
    stage: { type: String },
  },
  { timestamps: true }
);

const VideoJob: Model<IVideoJob> =
  mongoose.models.VideoJob || mongoose.model<IVideoJob>("VideoJob", VideoJobSchema);

export default VideoJob;
