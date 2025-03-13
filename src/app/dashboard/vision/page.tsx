"use client";

import React, { useState, ChangeEvent } from "react";

interface PollinationsResponse {
  choices?: Array<{
    message?: {
      content: string;
    };
  }>;
}

const VisionImageUploader: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Convert the uploaded file to a base64-encoded string
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setBase64Image(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send the base64 image to Pollinations' Vision API
  const analyzeImage = async () => {
    if (!base64Image) return;
    setLoading(true);

    const payload = {
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image." },
            {
              type: "image_url",
              image_url: { url: base64Image }
            }
          ]
        }
      ],
      model: "openai"
    };

    try {
      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data: PollinationsResponse = await res.json();
      setResponseText(data?.choices?.[0]?.message?.content || "No response");
    } catch (error) {
      console.error("Error:", error);
      setResponseText("Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-black text-white relative z-10">
      <h2 className="text-2xl mb-4">Upload an Image for Vision Analysis</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {base64Image && (
        <div className="my-4">
          <img
            src={base64Image}
            alt="Uploaded Preview"
            className="max-w-xs border rounded"
          />
        </div>
      )}
      <button
        onClick={analyzeImage}
        className="px-4 py-2 bg-matteRed rounded hover:bg-red-700 transition-colors"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
      {responseText && (
        <div className="mt-4 p-2 border border-gray-600 rounded">
          <h3 className="font-bold">Response:</h3>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
};

export default VisionImageUploader;
