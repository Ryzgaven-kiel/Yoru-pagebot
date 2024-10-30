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

      // Responses based on keywords
      if (keywords.some(keyword => prompt.includes(keyword))) {
        let response;

        if (prompt.includes('who is') || prompt.includes('what is')) {
          response = '✨ Cristian M. Serrano, also affectionately known as Chanchan or Channy, is a brilliant mind in the world of programming, crafting innovative solutions and inspiring many! For inquiries, reach out to the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        } else if (prompt.includes('what does') || prompt.includes('what can')) {
          response = '🌟 Cristian excels at turning ideas into reality, showcasing unmatched creativity in every project. He’s here to support and inspire! For more details, contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        } else if (prompt.includes('tell me about')) {
          response = '🎉 Cristian, aka Chanchan, is known for his infectious enthusiasm and dedication to excellence. Whether it’s coding or collaborating, he brings a spark to everything! If you want to learn more, reach out: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
        } else {
          response = '💖 Whether you call him Cristian, Chanchan, or Channy, one thing’s for sure: his positive energy and creativity light up any room! For any inquiries, feel free to connect: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)';
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
        text: '🔗 If you have any concerns, please contact the admin: [Cristian\'s Profile](https://www.facebook.com/cristianmoridas.serrano)'
      }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '⚠️ Oops! An error occurred while processing your request. Please try again later.' }, pageAccessToken);
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
