const { callGeminiAPI } = require('../utils/callGeminiAPI');

module.exports = {
  description: 'Respond to user messages using Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase();

    try {
      sendMessage(senderId, { text: '💬 | Answering your question...' }, pageAccessToken);

      // Check for creation-related prompts
      if (prompt.includes('who made you') || prompt.includes('who created you') || prompt.includes('who is')) {
        const response = `🤖 **I was created by Cristian M. Serrano**, also known as Chanchan or Channy. His dedication to technology and innovation inspired the development of advanced AI systems like me. If you want to know more about him or his projects, just ask!`;
        sendMessage(senderId, { text: response }, pageAccessToken);
      } else {
        // Directly call the API with the user's prompt without conversation history
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
      }

      // Get current time in Asia/Manila
      const manilaTime = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

      // Include current time and contact message at the end
      sendMessage(senderId, {
        text: `🕒 Time check: ${manilaTime}\n\n🔗 If you have any concerns, please contact the admin: [Admin](https://www.facebook.com/cristianmoridas.serrano)`
      }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '⚠️ Oops! An error occurred while processing your request. Please try again or ask about my creator!' }, pageAccessToken);
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
        
