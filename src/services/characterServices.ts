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
  const physicalAttrs = character.physicalAttributes || {};
  const physicalText = Object.entries(physicalAttrs)
    .map(([key, value]) => {
      if(key==='height') return `${key}: ${value}cm`;
      if(key==='build') return `${key}: ${value}`;
      return "";
    })
    .join(", ");
  
  // Construct the image generation prompt
  const prompt = `
    A professional portrait of ${name}, a ${age} person of ${ethnicity} origin.
    They have ${hairColor} ${hairStyle}, ${eyeColor} eyes, a ${faceShape} face, and ${skinTone} skin. Physical build: ${physicalText}.
    They are wearing ${style} clothing.
    The image should be professional, well-lit, and presentable.
  `.trim();

  return prompt;
};

export const generatePersonalityPrompt = (character: any): string => {
  const name = character.name || "This character";
  const personalityTraits = character.personalityTraits?.length
    ? character.personalityTraits.join(", ")
    : "balanced and well-rounded";
  const assistantRole = character.assistantRole || "a helpful assistant";
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

  const backgroundStory = character.backgroundStory || "They have an interesting background that shapes their personality.";

  // Construct the personality prompt
  const prompt = `
    ${name} is ${assistantRole} with a personality that is best described as ${personalityTraits}.
    They are passionate about ${hobbies} and have a deep interest in ${favoriteThings}.
    ${preferencesText} ${backgroundStory}
    They are known for being helpful, professional, and highly engaging in conversations.
  `.trim();

  return prompt;
};
