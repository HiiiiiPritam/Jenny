"use client"
import { useState } from 'react';

import { CustomizationOptions } from '../types/imageOptions';

const usePollinationsImage = ({baseprompt, options}: {baseprompt:string,options:CustomizationOptions}) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fixed anatomical description (defining facial and body structure)
  const fixedAnatomical = baseprompt;

  // Fixed background description (camera effects and environmental details)
  const fixedBackground = " The scene is illuminated by soft ambient lighting, enhanced with backlit and side-lit effects that create a gentle golden hour glow. Captured using an early 2000s digital camera with a weak sensor, the image exhibits noticeable grain and noise—especially in shadowed and background areas—with strong compression artifacts reminiscent of multiple low-quality JPEG saves. A slight motion blur due to unsteady hands and subtle lens distortion warps the edges, contributing to a vintage, low-quality aesthetic. The white balance is imperfect, lending a faint yellowish-green tint, while soft shadows and a shallow depth of field introduce a bokeh effect that softly blurs the foreground. The overall composition follows the rule of thirds, with a slight vignette and chromatic aberration at the edges, muted colors, and low dynamic range, all of which enhance the aged, candid charm of the photograph.";

  // Build customizable details from provided fields.
  const generateImageUrl = () => {
    const {
      seed,
      bodylength,
      dress,
      posture,
      pose,
      expression,
      accessories,
      makeup,
      glasses,
      additionalDetail,
    } = options;

    const details: string[] = [];
    if(bodylength) details.push(`The image is a ${bodylength} image`);
    if (dress) details.push(`wearing ${dress}`);
    if (posture) details.push(`with a ${posture} posture`);
    if (pose) details.push(`striking a ${pose} pose`);
    if (expression) details.push(`displaying a ${expression} expression`);
    if (accessories) details.push(`adorned with ${accessories}`);
    if (makeup) details.push(`enhanced with ${makeup} makeup`);
    if (glasses) details.push(`wearing ${glasses} glasses`);
    if (additionalDetail) details.push(`${additionalDetail}`);
    if(bodylength) details.push(`The image is a ${bodylength} image`);
    
    // Combine the customizable details into one sentence (if any)
    const extraDetails = details.length > 0 ? details.join(', ') + '. ' : '';

    // Compose the final prompt by sandwiching the dynamic details between fixed parts
    const finalPrompt = `${fixedAnatomical} ${extraDetails}${fixedBackground}`;

    console.log(finalPrompt);
    

    // URL-encode the complete prompt and append the seed parameter
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&model=flux&width=1080&height=1920&seed=16707&nologo=true&private=true&enhance=true&safe=false`;

    setImageUrl(url);
  };

  return { imageUrl, generateImageUrl };
};

export default usePollinationsImage;
