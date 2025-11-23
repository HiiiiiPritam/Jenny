import VideoJob from "@/models/VideoJob";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { path as ffprobePath } from "ffprobe-static";
import { v2 as cloudinary } from "cloudinary";



// Fix for Next.js bundling issue with ffprobe-static
const getFfprobePath = () => {
  if (process.env.NODE_ENV === "development") {
    // In dev, point directly to node_modules
    return path.join(process.cwd(), "node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe");
  }
  // In production, fallback to the imported path (or handle accordingly)
  return ffprobePath;
};

// Fix for Next.js bundling issue with ffmpeg-static
const getFfmpegPath = () => {
  if (process.env.NODE_ENV === "development") {
    return path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe");
  }
  return ffmpegPath;
};

const resolvedFfmpegPath = getFfmpegPath();
if (resolvedFfmpegPath) {
  ffmpeg.setFfmpegPath(resolvedFfmpegPath);
}

const resolvedFfprobePath = getFfprobePath();
if (resolvedFfprobePath) {
  ffmpeg.setFfprobePath(resolvedFfprobePath);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure DB connection (redundant but safe)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

const logDebug = (message: string) => {
  const logPath = path.join(process.cwd(), "debug.log");
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    console.log(`[VideoService] ${message}`); // Also log to console as requested
  } catch (e) {
    console.error("Failed to write log:", e);
  }
};

// Retry helper
const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 2000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (retries <= 0) throw error;
    logDebug(`Operation failed: ${error.message}. Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
};

const downloadImage = async (url: string, filepath: string) => {
  logDebug(`downloadImage called for ${url}`);
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      timeout: 30000, // 30s timeout for request
    });
    logDebug(`Response received for ${url}`);

    return new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);
      
      const timeout = setTimeout(() => {
        logDebug(`Download timed out for ${url}`);
        writer.destroy();
        reject(new Error("Download timeout"));
      }, 60000); // 60s timeout for download (increased)

      writer.on("finish", () => {
        logDebug(`Download finished for ${url}`);
        clearTimeout(timeout);
        resolve(undefined);
      });
      
      writer.on("error", (err: any) => {
        logDebug(`Download error for ${url}: ${err.message}`);
        clearTimeout(timeout);
        reject(err);
      });
    });
  } catch (error: any) {
    logDebug(`Axios error for ${url}: ${error.message}`);
    throw error;
  }
};

export const processVideoJob = async (jobId: string) => {
  logDebug(`Starting processing for job ${jobId}`);
  await connectDB();

  try {
    const job = await VideoJob.findById(jobId);
    if (!job) {
      logDebug(`Job ${jobId} not found in DB`);
      return;
    }

    job.status = "PROCESSING";
    job.progress = 0;
    job.stage = "Initializing";
    await job.save();
    logDebug(`Job ${jobId} status set to PROCESSING`);

    const tempDir = path.join(process.cwd(), "public", "temp", jobId);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate 5 images with slight variations
    const imagePaths: string[] = [];
    const basePrompt = job.prompt;
    
    // Pollinations URL structure: https://image.pollinations.ai/prompt/{prompt}?seed={seed}
    for (let i = 0; i < 5; i++) {
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?seed=${seed}&width=1024&height=576&nologo=true`;
      const imagePath = path.join(tempDir, `image_${i}.jpg`);
      
      logDebug(`Downloading image ${i + 1}/5: ${imageUrl}`);
      
      // Update progress
      job.progress = 10 + (i * 15); // 10, 25, 40, 55, 70
      job.stage = `Downloading image ${i + 1}/5`;
      await job.save();

      // Use retry logic for downloads
      await retryOperation(() => downloadImage(imageUrl, imagePath));
      
      imagePaths.push(imagePath);
    }

    // Create Video using FFMPEG
    const outputVideoPath = path.join(process.cwd(), "public", "videos", `${jobId}.mp4`);
    
    // Ensure output dir exists
    const videosDir = path.dirname(outputVideoPath);
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    logDebug("Stitching video...");
    job.progress = 85;
    job.stage = "Stitching video";
    await job.save();
    
    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg();
      
      // Add input images
      imagePaths.forEach(img => {
        command.input(img).loop(2); // Show each image for 2 seconds
      });

      command
        .on("end", () => {
          logDebug("Video processing finished");
          resolve(undefined);
        })
        .on("error", (err: any) => {
          logDebug(`FFMPEG Error: ${err.message}`);
          reject(err);
        })
        .mergeToFile(outputVideoPath, tempDir); // Merge inputs
    });

    // Upload to Cloudinary
    logDebug("Uploading to Cloudinary...");
    job.progress = 95;
    job.stage = "Uploading";
    await job.save();
    let publicVideoUrl = `/videos/${jobId}.mp4`; // Fallback to local

    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        const uploadResult = await cloudinary.uploader.upload(outputVideoPath, {
          resource_type: "video",
          folder: "ai-assistant-videos",
          public_id: jobId,
        });
        publicVideoUrl = uploadResult.secure_url;
        logDebug(`Uploaded to Cloudinary: ${publicVideoUrl}`);
        
        // Cleanup local video file if upload success
        if (fs.existsSync(outputVideoPath)) {
             fs.unlinkSync(outputVideoPath);
        }
      } else {
        logDebug("Cloudinary credentials missing, using local file.");
      }
    } catch (uploadError: any) {
      logDebug(`Cloudinary upload failed: ${uploadError.message}. Keeping local file.`);
    }

    // Cleanup temp images
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Update Job
    job.status = "COMPLETED";
    job.videoUrl = publicVideoUrl;
    job.progress = 100;
    job.stage = "Completed";
    await job.save();
    logDebug(`Job ${jobId} completed successfully.`);

  } catch (error: any) {
    logDebug(`Job ${jobId} failed: ${error.message}`);
    const job = await VideoJob.findById(jobId);
    if (job) {
      job.status = "FAILED";
      job.error = error.message || "Unknown error";
      await job.save();
    }
  }
};
