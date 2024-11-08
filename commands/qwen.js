const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'qwen',
  description: 'Talk to Qwen AI',
  role: 1,
  author: 'Jay Mar',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();
    
    if (!prompt) {
      return sendMessage(senderId, { text: '🌟 Please provide a question.' }, pageAccessToken);
    }

    const apiUrl = `https://www.geo-sevent-tooldph.site/api/Qwen1.572BChat?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const text = response.data.response || 'No response received from Qwen-1.572BChat. Please try again later.';
      const maxMessageLength = 2000;

      const formattedResponse = `🤖 𝗤𝗪𝗘𝗡 𝗔𝗜\n\n${text}`;

      if (formattedResponse.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(formattedResponse, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Qwen API:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
        }
      
