import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import VideoJob from "@/models/VideoJob";
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await connectDB();

    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), "debug.log");
    fs.appendFileSync(logPath, `[API] Fetching jobs for user: ${session.user.id}\n`);

    const jobs = await VideoJob.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    fs.appendFileSync(logPath, `[API] Found jobs: ${jobs.length}\n`);
    // Log the first job to see its status
    if (jobs.length > 0) {
       fs.appendFileSync(logPath, `[API] First job: ${JSON.stringify(jobs[0])}\n`);
    }

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Error listing video jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
