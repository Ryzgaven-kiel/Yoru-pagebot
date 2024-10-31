const axios = require('axios');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'fbcover',
  description: 'Generate a Facebook cover photo based on a text prompt.',
  usage: 'fbcover <prompt>',
  author: 'Your Name',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, { text: '❌ Please provide a prompt for the Facebook cover photo generation.' }, pageAccessToken);
    }

    try {
      sendMessage(senderId, { text: '🖼️ Generating your Facebook cover photo...' }, pageAccessToken);

      // Call an image generation API (e.g., DALL-E) with the prompt
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: prompt,
        n: 1,
        size: '1024x512' // Facebook cover photo size
      }, {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY', // Replace with your actual API key
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.data[0].url; // Extract the image URL from the response
      sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
    } catch (error) {
      console.error('Error generating cover photo:', error.response ? error.response.data : error.message);
      sendMessage(senderId, { text: '⚠️ An error occurred while generating your Facebook cover photo. Please try again later.' }, pageAccessToken);
    }
  }
};
