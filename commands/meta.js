const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'meta',
  description: 'Ask a question to the Meta AI',
  role: 1,
  author: 'Cristian',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').trim();

    // If there's no query, provide an introductory message
    if (!query) {
      return sendMessage(senderId, { text: 'Hello, I\'m Meta AI. How can I assist you today?' }, pageAccessToken);
    }

    const apiUrl = `https://api.y2pheq.me/meta?prompt=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl);

      // Check if the API returned the expected response
      if (response.data && response.data.response) {
        const formattedResponse = `🤖 𝗠𝗘𝗧𝗔 𝗔𝗜\n\n${response.data.response}`;
        await sendResponseInChunks(senderId, formattedResponse, pageAccessToken);
      } else {
        // Handle unexpected or missing response data
        await sendMessage(senderId, { text: 'Sorry, Meta AI couldn\'t process your request at this time.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Meta API:', error.message || error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};

// Helper function to send long responses in chunks
async function sendResponseInChunks(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

// Splits a message into chunks based on word boundaries for better readability
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  let chunk = '';
  const words = message.split(' ');

  for (const word of words) {
    if ((chunk + word).length > chunkSize) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += `${word} `;
  }

  if (chunk) {
    chunks.push(chunk.trim());
  }

  return chunks;
    }
        
