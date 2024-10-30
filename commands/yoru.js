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

      // Check for creation-related prompts
      if (prompt.includes('who made you') || prompt.includes('who created you') || prompt.includes('who is')) {
        const response = `Cristian M. Serrano, often known as Chanchan or Channy, is the brilliant mind behind my creation. His passion for technology and innovation has driven him to develop advanced AI systems that can assist and engage with users like you. Cristian's vision was to create an AI that can understand and respond intelligently, providing valuable information and companionship.\n\nCristian’s journey in programming started early, and he has continually honed his skills through various projects. His expertise not only lies in coding but also in understanding the needs of users, making him a unique creator in the tech world. \n\nWhen you interact with me, you’re experiencing the result of his hard work and dedication to enhancing human-computer interaction. His commitment to pushing the boundaries of what AI can do is truly inspiring.\n\nIf you want to know more about Cristian or his projects, feel free to ask!`;
        sendMessage(senderId, { text: response }, pageAccessToken);
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

      // Get current time in Asia/Manila
      const manilaTime = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

      // Include current time and contact message at the end
      sendMessage(senderId, {
        text: `🕒 Current time check: ${manilaTime}\n\n🔗 If you have any concerns, please contact the admin: ==> (https://www.facebook.com/cristianmoridas.serrano)`
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
    
