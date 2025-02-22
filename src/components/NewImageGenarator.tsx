import React, { useState } from "react";

const basePrompt = "brazilian girl 19 years old with fair skin and curly hair";
const baseUrl = "https://image.pollinations.ai/prompt/";
const seed = "11198";

export const ImageGenerator: React.FC = () => {
  const [dressType, setDressType] = useState("");
  const [pose, setPose] = useState("");
  const [facialExpression, setFacialExpression] = useState("");
  const [randomFactor, setRandomFactor] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const generateImage = () => {
    let prompt = `${basePrompt}`;
    if (dressType) prompt += ` wearing ${dressType}`;
    if (pose) prompt += ` in a ${pose} pose`;
    if (facialExpression) prompt += ` with a ${facialExpression} expression`;
    if (randomFactor) prompt += ` ${randomFactor}`;

    const formattedPrompt = encodeURIComponent(prompt);
    const finalUrl = `${baseUrl}${formattedPrompt}%206345236482?seed=${seed}`;
    setImageUrl(finalUrl);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>AI Image Generator</h2>
      <div>
        <label>Dress Type: </label>
        <input type="text" value={dressType} onChange={(e) => setDressType(e.target.value)} />
      </div>
      <div>
        <label>Pose: </label>
        <input type="text" value={pose} onChange={(e) => setPose(e.target.value)} />
      </div>
      <div>
        <label>Facial Expression: </label>
        <input type="text" value={facialExpression} onChange={(e) => setFacialExpression(e.target.value)} />
      </div>
      <div>
        <label>Random Factor: </label>
        <input type="text" value={randomFactor} onChange={(e) => setRandomFactor(e.target.value)} />
      </div>
      <button onClick={generateImage} style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}>
        Generate Image
      </button>
      {imageUrl && (
        <div>
          <h3>Generated Image:</h3>
          <img src={imageUrl} alt="Generated AI" style={{ maxWidth: "100%", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

