const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'meta',
  description: 'Ask a question to the Meta AI',
  role: 1,
  author: 'Cristian',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').trim();

    if (!query) {
      return sendMessage(senderId, { text: 'Hello, I\'m Meta AI. How can I assist you today?' }, pageAccessToken);
    }

    const apiUrl = `https://api.y2pheq.me/meta?prompt=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl);

      // Log the full response to understand its structure
      console.log('API response data:', response.data);

      // Check if the response has the expected format
      if (response.status === 200 && response.data && response.data.response) {
        const formattedResponse = `🤖 𝗠𝗘𝗧𝗔 𝗔𝗜\n\n${response.data.response}`;
        await sendResponseInChunks(senderId, formattedResponse, pageAccessToken);
      } else {
        // Log a message if the response structure is unexpected
        console.warn('Unexpected response structure or missing "response" field');
        await sendMessage(senderId, { text: 'Sorry, Meta AI couldn\'t process your request at this time.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Meta API:', error.message || error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};

// Helper functions remain the same...
