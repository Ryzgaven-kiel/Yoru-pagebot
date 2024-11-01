const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Simulated database for user context (could be replaced with a real database)
const userContext = {};

module.exports = {
  name: 'blackbox',
  description: 'Generate text using Blackbox AI API with contextual memory',
  author: 'chatgpt',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');

    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: /blackbox <question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: '🤖 Blackbox is generating a response, please wait...' }, pageAccessToken);

    try {
      // Retrieve previous context for the user, if available
      const previousContext = userContext[senderId] || '';
      const fullPrompt = `${previousContext} ${prompt}`.trim();

      // Prepare API parameters
      const conversationId = senderId; // Use senderId as conversation ID to maintain user context
      const model = 'gpt-4o'; // Specify the model
      const apiUrl = `https://joshweb.click/blackbox?prompt=hi`;
      
      // Make the API call
      const response = await axios.get(apiUrl);

      // Check if the response is valid and retrieve the result
      const result = response.data.response || 'There was an error generating the response. Please try again later.';

      // Send the generated text to the user with proper concatenation
      sendMessage(senderId, { text: "🤖 Blackbox AI:\n\n" + result }, pageAccessToken);

      // Update the user context with the new prompt and response for future interactions
      userContext[senderId] = `${fullPrompt}\n${result}`;

    } catch (error) {
      console.error('Error calling Blackbox API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
