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
        
