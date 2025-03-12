export const generateImagePrompt = (character: any): string => {
  // Extract relevant attributes with defaults
  const name = character.name || "A mysterious person";
  const ethnicity = character.ethnicity || "unspecified ethnicity";
  const hairColor = character.hairColor || "black";
  const hairStyle = character.hairStyle || "short hair";
  const eyeColor = character.eyeColor || "brown";
  const skinTone = character.skinTone || "fair";
  const faceShape = character.faceShape || "oval";
  const age = character.age ? `${character.age} years old` : "young adult";
  const style = character.style || "casual";
  const personality = character.personalityTraits?.length
    ? character.personalityTraits.join(", ")
    : "calm and confident";
  
  // Construct the image generation prompt
  const prompt = `
    A highly detailed portrait of ${name}, a ${age} female of ${ethnicity} origin.
    They have ${hairColor} ${hairStyle}, ${eyeColor} eyes, a ${faceShape} face, and ${skinTone} skin.
    They are wearing ${style} clothing. Their personality is described as ${personality}.
    The image should be realistic, well-lit, and aesthetically pleasing.
  `.trim();

  return prompt;
};

export const generatePersonalityPrompt = (character: any): string => {
  const name = character.name || "This character";
  const personalityTraits = character.personalityTraits?.length
    ? character.personalityTraits.join(", ")
    : "balanced and well-rounded";
  const relationshipType = character.relationshipType || "a friendly companion";
  const hobbies = character.hobbies?.length
    ? character.hobbies.join(", ")
    : "various activities";
  const favoriteThings = character.favoriteThings?.length
    ? character.favoriteThings.join(", ")
    : "a mix of interests";
  const preferences = character.preferences || { likes: [], dislikes: [] };

  // Construct likes & dislikes sentence
  const likes = preferences.likes?.length
    ? `They enjoy ${preferences.likes.join(", ")}.`
    : "";
  const dislikes = preferences.dislikes?.length
    ? `They dislike ${preferences.dislikes.join(", ")}.`
    : "";
  const preferencesText = [likes, dislikes].filter(Boolean).join(" ");

  const backgroundStory = character.backgroundStory || "They have an intriguing past, shaping their personality.";

  // Construct the personality prompt
  const prompt = `
    ${name} is ${relationshipType} with a personality that is best described as ${personalityTraits}.
    They are passionate about ${hobbies} and have a deep interest in ${favoriteThings}.
    ${preferencesText} ${backgroundStory}
    They are known for being engaging, thoughtful, and highly interactive in conversations.
  `.trim();

  return prompt;
};
