const { callGeminiAPI } = require('../utils/callGeminiAPI');

module.exports = {
  name: 'act',
  description: 'Ask a question to the Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase(); // Convert to lower case for case-insensitive comparison
    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

      // Check for specific questions
      if (prompt === 'who is your creator' || prompt === 'who is cristian m. serrano') {
        return sendMessage(senderId, { text: 'My creator is Cristian M. Serrano, a 2nd year college student expert in Python programming language.' }, pageAccessToken);
      }

      const response = await callGeminiAPI(prompt);

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (response.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(response, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: response }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: 'An error occurred. Please try again later.' }, pageAccessToken);
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
