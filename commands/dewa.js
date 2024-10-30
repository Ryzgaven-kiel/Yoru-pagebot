const axios = require('axios');

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
        size: '1024x1024' // You can adjust the size as needed
      }, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY`, // Replace with your OpenAI API key
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.data[0].url; // Extract the image URL from the response
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
    } catch (error) {
      console.error('Error generating image:', error);
      sendMessage(senderId, { text: '⚠️ An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};
    
