"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import axios from "axios";

interface VideoJob {
  _id: string;
  prompt: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  videoUrl?: string;
  error?: string;
  progress?: number;
  stage?: string;
  createdAt: string;
}

const VideoPage = () => {
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState("");
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/video/list");
      setJobs(res.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchJobs();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      await axios.post("/api/video/create", { prompt });
      showToast("Video generation started!", "success");
      setPrompt("");
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
      showToast("Failed to start generation", "error");
    } finally {
      setGenerating(false);
    }
  };

  if (status === "loading") return <LoadingSpinner size="lg" message="Loading..." />;

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Please login to access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AI Video Creator
        </h1>

        {/* Creation Section */}
        <motion.div 
          className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Create New Video</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video (e.g., 'A futuristic city with flying cars')"
              className="flex-1 bg-black/50 border border-white/20 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={generating}
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className={`px-8 py-4 rounded-xl font-bold transition-all ${
                generating || !prompt.trim()
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105"
              }`}
            >
              {generating ? "Queuing..." : "Generate"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Note: Video generation takes 1-2 minutes. You can leave this page and come back later.
          </p>
        </motion.div>

        {/* Gallery Section */}
        <h2 className="text-2xl font-semibold mb-6">Your Videos</h2>
        {loading ? (
          <LoadingSpinner size="md" />
        ) : jobs.length === 0 ? (
          <p className="text-gray-400">No videos yet. Create one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="aspect-video bg-black relative flex items-center justify-center">
                  {job.status === "COMPLETED" && job.videoUrl ? (
                    <video 
                      src={job.videoUrl} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 w-full px-4">
                      {job.status === "FAILED" ? (
                        <span className="text-red-500">Generation Failed</span>
                      ) : (
                        <>
                          {job.status === "PROCESSING" ? (
                            <div className="flex flex-col items-center gap-3 w-3/4">
                              <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <motion.div 
                                  className="bg-purple-500 h-2.5 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.progress || 0}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <span className="text-purple-400 text-xs text-center">
                                {job.stage || "Processing..."} ({job.progress || 0}%)
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-purple-400 text-sm">Queued...</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{job.prompt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      job.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                      job.status === "FAILED" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  {job.error && (
                    <p className="text-xs text-red-400 mt-2">{job.error}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default VideoPage;