const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Simulated database for user context (could be replaced with a real database)
const userContext = {};

module.exports = {
  name: 'ai',
  description: 'Generate text using GPT-4o API with contextual memory',
  author: 'chatgpt',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');

    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: /ai <question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: '🤖 Generating response, please wait...' }, pageAccessToken);

    try {
      // Retrieve previous context for the user, if available
      const previousContext = userContext[senderId] || '';
      const fullPrompt = `${previousContext} ${prompt}`.trim();

      const apiUrl = `https://cristian-api.onrender.com/api/blackbox?text=Hello%20AI&conversationId=435HGS&model=gpt-4o`;
      const response = await axios.get(apiUrl);

      // Extract the result from the response
      const result = response.data.result;

      // Send the generated text to the user with proper concatenation
      sendMessage(senderId, { text: "🤖 Yoru AI:\n\n" + result }, pageAccessToken);

      // Update the user context with the new prompt and response for future interactions
      userContext[senderId] = `${fullPrompt}\n${result}`;

    } catch (error) {
      console.error('Error calling GPT-4o API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
