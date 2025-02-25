import React, { useState } from 'react';
import usePollinationsImage from '../../hooks/useGenerateImage';
import { CustomizationOptions } from '../../types/imageOptions';
import sophia from '../../assets/sophia.png';
import elena from '../../assets/elena.png';
import hinata from '../../assets/hinata.png';
interface Character {
  name: string;
  seed: string;
  image: string;
  basePrompt: string;
}

// Define a list of characters with fixed facial structures and seeds
const characters: Character[] = [
  {
    name: "Sophia",
    seed: "27589",
    image: sophia, // Replace with actual image paths
    basePrompt: "A candid, unposed full-body photo of a Brazilian woman, a 25-year-old with fair skin and an oval face featuring high cheekbones, a defined jawline, and a smooth, unlined forehead. She has striking emerald green, almond-shaped eyes with long, thick lashes and perfectly arched eyebrows. Her straight, slender nose with a well-defined bridge harmonizes with her full, naturally glossy lips that are slightly parted in a gentle, inviting smile. Her long, wavy auburn hair with soft natural highlights cascades gracefully over her shoulders, neatly parted in the middle. A delicate sprinkle of freckles adorns her cheeks and across the bridge of her nose, while a subtle blush enhances her naturally radiant complexion, displaying visible pores and minor blemishes that add to her realism.",
  },
  {
    name: "Hinata",
    seed: "39010",
    image: hinata,
    basePrompt: "A full-body image of a 25-year-old Asian woman with a warm, light complexion and a delicate oval-shaped face. She has high cheekbones, a softly tapered jawline, and a slightly rounded chin. Her almond-shaped, deep brown eyes are framed by long, dark lashes and softly arched, well-groomed eyebrows. Her small, straight nose has a subtle upturn at the tip, and her full lips have a natural peach-pink hue with a gentle, inviting smile. Her skin is smooth with a soft glow, featuring faint freckles across her nose and minimal visible pores. A small beauty mark is subtly placed below her left eye.Her body is slender and gracefully proportioned, with defined collarbones, petite shoulders, and a slim, toned waist. She has soft curves, naturally rounded hips, and long, elegant legs with smooth, flawless skin. Her arms are slim and delicate, with graceful hands and neatly manicured fingers.",
  },
  {
    name: "Elena",
    seed: "8281",
    image: elena,
    basePrompt: "A full-body image of a 25-year-old Brazilian woman with a warm tan complexion and a heart-shaped face. She has high cheekbones, a softly defined jawline, and a slightly pointed chin. Her almond-shaped, emerald green eyes are framed by thick, dark lashes and naturally arched eyebrows. Her straight nose has a slightly upturned tip, and her full lips have a natural pink hue. A small beauty mark rests above her upper lip. Her skin has visible pores and faint freckles across her cheeks and nose. Her body is toned and curvy, with defined collarbones, rounded shoulders, and a slim waist. She has full, well-proportioned hips, a naturally prominent backside, and long, sculpted legs. Her arms are slender but toned, with delicate wrists and well-manicured hands.",
  },
];

const CharacterSelectionPage: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [dress, setDress] = useState("");
  const [posture, setPosture] = useState("");
  const [pose, setPose] = useState("");
  const [expression, setExpression] = useState("");
  const [accessories, setAccessories] = useState("");
  const [additionalDetail, setAdditionalDetail] = useState("");
  const [bodylength, setBodylength] = useState("");

  // When user selects a character, update the state
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  // Prepare options for the image generation hook
  const options: CustomizationOptions = selectedCharacter
    ? {
        seed: selectedCharacter.seed,
        dress,
        posture,
        pose,
        expression,
        accessories,
        additionalDetail,
        bodylength,
      }
    : {
        seed: "27589",
      };

  const { imageUrl, generateImageUrl } = usePollinationsImage({baseprompt: selectedCharacter ? selectedCharacter.basePrompt : "", options});

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCharacter) {
      generateImageUrl();
    } else {
      alert("Please select a character first!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose Your Character</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {characters.map((character) => (
          <div
            key={character.seed}
            style={{
              cursor: "pointer",
              textAlign: "center",
              border: selectedCharacter?.seed === character.seed ? "3px solid blue" : "1px solid gray",
              padding: "10px",
              borderRadius: "10px",
            }}
            onClick={() => handleCharacterSelect(character)}
          >
            <img
              src={character.image}
              alt={character.name}
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
            />
            <p>{character.name}</p>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <>
          <h2>Customize {selectedCharacter.name}</h2>
          <form onSubmit={handleGenerate} style={{ display: "grid", gridGap: "10px", maxWidth: "500px" }}>
            <div>
              <label>Dress: </label>
              <input type="text" value={dress} onChange={(e) => setDress(e.target.value)} />
            </div>
            <div>
              <label>Posture: </label>
              <input type="text" value={posture} onChange={(e) => setPosture(e.target.value)} />
            </div>
            <div>
              <label>Pose: </label>
              <input type="text" value={pose} onChange={(e) => setPose(e.target.value)} />
            </div>
            <div>
              <label>Expression: </label>
              <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)} />
            </div>
            <div>
              <label>Accessories: </label>
              <input type="text" value={accessories} onChange={(e) => setAccessories(e.target.value)} />
            </div>
            <div>
              <label>Additional Details: </label>
              <input type="text" value={additionalDetail} onChange={(e) => setAdditionalDetail(e.target.value)} />
            </div>
            <div>
              <label>Body Length: </label>
              <input type="text" value={bodylength} onChange={(e) => setBodylength(e.target.value)} />
            </div>
            <button type="submit">Generate Image</button>
          </form>

          {imageUrl && (
            <div style={{ marginTop: "20px" }}>
              <p>
                <strong>Generated URL:</strong>{" "}
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  {imageUrl}
                </a>
              </p>
              <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterSelectionPage;
