"use client";
import { useState } from "react";

function Page() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function generateSpeech(text: string) {
    const response = await fetch("/api/experiments/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("Failed to generate speech");
      return;
    }

    // Convert response to a Blob and create an object URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
  }

  return (
    <div>
      <h1>Experiments</h1>
      <button onClick={() => generateSpeech("Just write back the below next written things dont write anything else , just these : 'hello lady i wnat to kiss you'")}>
        Generate Speech
      </button>
      {audioUrl && (
        <audio controls autoPlay>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default Page;
