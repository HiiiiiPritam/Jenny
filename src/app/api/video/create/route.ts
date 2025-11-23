import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Adjust path if needed
import VideoJob from "@/models/VideoJob";
import mongoose from "mongoose";
import { processVideoJob } from "@/services/videoService";

// Ensure DB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    await connectDB();

    const job = await VideoJob.create({
      userId: session.user.id,
      prompt,
      status: "PENDING",
    });

    // Trigger processing in background (fire and forget)
    // Note: In serverless (Vercel), this might be killed if the function returns.
    // For local dev, this works. For production, use a queue (Redis/Bull) or Vercel Cron/Functions.
    processVideoJob((job as any)._id.toString()).catch((err: any) => console.error("Background processing error:", err));

    return NextResponse.json({ jobId: job._id, status: "PENDING" }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating video job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
