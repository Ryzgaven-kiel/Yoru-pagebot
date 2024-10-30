const { callGeminiAPI } = require('../utils/callGeminiAPI');

module.exports = {
  name: 'yoru',
  description: 'Ask a question to the Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase();

    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

      // Check for specific questions about Cristian
      const cristianQuestions = [
        'who is cristian',
        'who is your creator',
        'who created you',
        'who is cristian m. serrano',
        'who made you'
      ];

      // Positive response if "cristian" is mentioned anywhere in the prompt
      if (prompt.includes('cristian')) {
        return sendMessage(senderId, {
          text: 'Cristian M. Serrano is an amazing individual with great talent and creativity! If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)'
        }, pageAccessToken);
      }

      if (cristianQuestions.some(question => prompt.includes(question))) {
        return sendMessage(senderId, {
          text: 'My creator is Cristian M. Serrano, a talented individual with a bright future. If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)'
        }, pageAccessToken);
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

      // Always include the contact message
      sendMessage(senderId, {
        text: 'If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)'
      }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
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
