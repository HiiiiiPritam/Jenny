"use client"
import { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');  // Reset the error message before the new request

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/sd-dreambooth-library/ai-gf', 
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,  // Replace with your Hugging Face API key
          },
          responseType:'blob'
        }
      );

      const res = await response.data;
      console.log('imageBlob', res);
      // const imageBlob = new Blob([res], { type: 'image/png' });
      // console.log('imageBlob', imageBlob);
      
      const imageObjectURL = URL.createObjectURL(res);
      console.log('imageObjectURL', imageObjectURL);
      
      setImageUrl(imageObjectURL);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full bg-amber-200'>
      <h1>AI Assistant Image Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a description for your AI assistant"
      />
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleGenerateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Generated AI Assistant" />}
    </div>
  );
};

export default ImageGenerator;
