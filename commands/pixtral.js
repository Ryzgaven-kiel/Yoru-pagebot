const { callPixtralAPI } = require('../utils/callPixtralAPI');

// Sample fun facts to enhance interaction
const funFacts = [
  "Did you know? Honey never spoils. Archaeologists found pots of honey in ancient Egyptian tombs that are over 3000 years old!",
  "Fun Fact: A group of flamingos is called a 'flamboyance.'",
  "Did you know? Sea otters hold hands while they sleep to avoid drifting apart.",
  "Quote of the Day: 'Success is not final, failure is not fatal: it is the courage to continue that counts.' - Winston Churchill"
];

module.exports = {
  name: 'pixtral',
  description: 'Ask Pixtral API about an image.',
  author: 'Cristian',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const imageUrl = args[0]; // Assuming the image URL is the first argument

    try {
      // Send initial response to the user
      sendMessage(senderId, { text: '🔍 | Analyzing image...' }, pageAccessToken);

      // If no image URL is provided, return a prompt to the user
      if (!imageUrl) {
        return sendMessage(senderId, { text: '⚠️ Please provide an image URL after the "pixtral" command.' }, pageAccessToken);
      }

      // Call the Pixtral API with the provided image URL
      const apiResponse = await callPixtralAPI(imageUrl);

      // Check if the API response needs to be split into smaller messages
      const maxMessageLength = 2000;
      if (apiResponse.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(apiResponse, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: apiResponse }, pageAccessToken);
      }

      // Get current time in Asia/Manila
      const manilaTime = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

      // Send a fun fact or quote at the end
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      sendMessage(senderId, {
        text: `🕒 Manila Time: ${manilaTime}\n\n✨ **Fun Fact:** ${randomFact}\n\n🔗 Contact Admin: [Admin](https://www.facebook.com/cristianmoridas.serrano)`
      }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Pixtral API:', error);
      sendMessage(senderId, {
        text: '⚠️ Oops! There was an issue processing your request. Here are some suggestions:\n1. Provide an image URL after "pixtral".\n2. Ask for a fun fact.\n3. Contact the admin for help.'
      }, pageAccessToken);
    }
  }
};

// Function to split large messages into chunks for Messenger
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
        }
          
