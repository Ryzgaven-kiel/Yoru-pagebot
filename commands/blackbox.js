const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'blackbox',
  description: 'Generate text using Blackbox AI',
  author: 'Your Name',
  async execute(senderId, args, pageAccessToken) {
    const text = args.join(' '); // Join the command arguments to form the input text
    const conversationId = 'unique_conversation_id'; // Change this to generate a unique ID for each conversation or use a persistent one if desired
    const model = 'gpt-4o'; // Specify the model to be used

    if (!text) {
      sendMessage(senderId, { text: "Usage: /blackbox <your question>" }, pageAccessToken);
      return;
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: 'Generating response, please wait...' }, pageAccessToken);

    try {
      // Construct the API URL for Blackbox
      const apiUrl = `https://cristian-api.onrender.com/api/blackbox?text=${encodeURIComponent(text)}&conversationId=${conversationId}&model=${model}`;
      
      // Make the GET request to the Blackbox API
      const response = await axios.get(apiUrl);
      const result = response.data.response; // Extract the response data

      // Send the generated text to the user
      sendMessage(senderId, { text: "🤖 Blackbox AI:\n\n" + result }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Blackbox API:', error);
      sendMessage(senderId, { text: 'There was an error generating the response. Please try again later.' }, pageAccessToken);
    }
  }
};
