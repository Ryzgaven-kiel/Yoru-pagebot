const { callGeminiAPI } = require('../utils/callGeminiAPI');

const conversationHistory = {}; // Store conversation context for each user

module.exports = {
  name: 'yoru',
  description: 'Ask a question to the Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase();

    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

      // Initialize conversation history if it doesn't exist
      if (!conversationHistory[senderId]) {
        conversationHistory[senderId] = [];
      }

      // Store user input in conversation history
      conversationHistory[senderId].push(prompt);

      // Keywords to identify mentions
      const keywords = ['cristian', 'chanchan', 'channy'];
      let response;

      // Responses based on keywords
      if (keywords.some(keyword => prompt.includes(keyword))) {
        if (prompt.includes('who is') || prompt.includes('what is')) {
          response = '✨ Cristian M. Serrano, also known as Chanchan or Channy, is a brilliant mind in programming...';
        } else if (prompt.includes('what does') || prompt.includes('what can')) {
          response = '🌟 Cristian excels at turning ideas into reality...';
        } else if (prompt.includes('tell me about')) {
          response = '🎉 Cristian is known for his infectious enthusiasm...';
        } else {
          response = '💖 Whether Cristian, Chanchan, or Channy, his energy lights up any room...';
        }
      } else {
        // Send entire conversation history to the API for context
        const context = conversationHistory[senderId].join(' ');
        const responseFromAPI = await callGeminiAPI(context + ' ' + prompt);

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
