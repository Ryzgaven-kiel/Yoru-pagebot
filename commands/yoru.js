const { callGeminiAPI } = require('../utils/callGeminiAPI');

module.exports = {
  name: 'yoru',
  description: 'Ask a question to the Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase();

    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

      // Keywords to identify mentions
      const keywords = ['cristian', 'chanchan', 'channy'];

      // Response generation based on keywords
      if (keywords.some(keyword => prompt.includes(keyword))) {
        let response;
        if (prompt.includes('who is') || prompt.includes('what is')) {
          response = 'Cristian M. Serrano, also known as Chanchan or Channy, is a talented individual with great creativity and skills in programming. If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        } else if (prompt.includes('what does') || prompt.includes('what can')) {
          response = 'Cristian is known for his innovative ideas and dedication to his work. He is always willing to help others. For more information, contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        } else {
          response = 'Cristian, Chanchan, or Channy—whatever you prefer to call him—always brings positivity and creativity to every project he undertakes! If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        }
        return sendMessage(senderId, { text: response }, pageAccessToken);
      }

      const responseFromAPI = await callGeminiAPI(prompt);

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (responseFromAPI.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(responseFromAPI, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: responseFromAPI }, pageAccessToken);
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
