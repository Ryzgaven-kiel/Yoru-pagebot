const axios = require('axios');

// Paste your DALL-E API key here
const API_KEY = 'sk-your-dalle-api-key-here';

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

      // Use the chat completions endpoint for DALL-E 3
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4", // Assumes DALL-E 3 is accessible via GPT-4
        messages: [
          { role: "system", content: "You are DALL-E, an AI that generates images from text prompts." },
          { role: "user", content: prompt }
        ],
        functions: [{ name: "generate_image", description: "Generates an image based on a prompt." }],
        function_call: { name: "generate_image" }
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.choices[0].message.function_call.arguments.url; // Adjust this line if the response structure differs
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
    } catch (error) {
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      sendMessage(senderId, { text: '⚠️ An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};
        
