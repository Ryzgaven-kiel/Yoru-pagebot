const { callGeminiAPI } = require('../utils/callGeminiAPI');

// Sample fun facts or quotes to enhance interaction
const funFacts = [
  "Did you know? The inventor of the frisbee was turned into a frisbee after he died.",
  "Fun Fact: Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3000 years old and still perfectly edible.",
  "Quote of the Day: 'The only way to do great work is to love what you do.' - Steve Jobs",
  "Did you know? Bananas are berries, but strawberries are not!",
];

module.exports = {
  name: 'yoru',
  description: 'Ask a question to the Yoru AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').toLowerCase();

    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

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

      // Include a fun fact or quote at the end
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

      // Include current time and contact message at the end
      sendMessage(senderId, {
        text: `🕒 time check: ${manilaTime}\n\n🔗 If you have any concerns, please contact the admin: [Admin](https://www.facebook.com/cristianmoridas.serrano)\n\n✨ **Fun Fact:** ${randomFact}`
      }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      sendMessage(senderId, { text: '⚠️ Oops! An error occurred while processing your request. Here are some suggestions:\n1. Ask about my creator.\n2. Request a fun fact.\n3. Inquire about any general topic.' }, pageAccessToken);
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
        
