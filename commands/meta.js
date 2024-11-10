const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'meta',
  description: 'Ask a question to the Meta AI',
  role: 1,
  author: 'Cristian',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').trim();

    // Check for an empty query and send an initial greeting if needed
    if (!query) {
      return sendMessage(senderId, { text: 'Hello, I\'m Meta AI. How can I assist you today?' }, pageAccessToken);
    }

    const apiUrl = `https://api.y2pheq.me/meta?prompt=${encodeURIComponent(query)}`;

    try {
      // Perform the GET request to the Meta API
      const response = await axios.get(apiUrl);

      // Check if the response data is structured as expected
      if (response.status === 200 && response.data && response.data.response) {
        const formattedResponse = `🤖 𝗠𝗘𝗧𝗔 𝗔𝗜\n\n${response.data.response}`;
        await sendResponseInChunks(senderId, formattedResponse, pageAccessToken);
      } else {
        // Log the entire response in case of unexpected structure
        console.error('Unexpected response structure:', response.data);
        await sendMessage(senderId, { text: 'Sorry, Meta AI couldn\'t process your request at this time.' }, pageAccessToken);
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error calling Meta API:', error.message || error);

      // Check if the error is due to a response from the server (4xx or 5xx status codes)
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      // Send a generic error message to the user
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

// Function to split a long message into chunks by word boundaries
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
