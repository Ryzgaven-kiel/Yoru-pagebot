const axios = require('axios');

// Paste your DALL-E API key here
const API_KEY = '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';

module.exports = {
  name: 'dewa',
  description: 'Generate an image based on a text prompt using OpenAI.',
  author: 'ChatGPT',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, { text: 'Please provide a prompt for the image generation.' }, pageAccessToken);
    }

    try {
      sendMessage(senderId, { text: '🖼️ | Generating your image...' }, pageAccessToken);

      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,  // Uses the API_KEY constant
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.data[0].url; // Extract the image URL from the response
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
    } catch (error) {
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      sendMessage(senderId, { text: '⚠️ An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};
        
