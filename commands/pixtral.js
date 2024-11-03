const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Simulated database for user context (could be replaced with a real database)
const userContext = {};

module.exports = {
  name: 'pixtral',
  description: 'Analyze an image using Pixtral API with contextual memory',
  author: 'your_name', // Update with your name or desired author
  async execute(senderId, args, pageAccessToken, message) {
    // Check if the message contains an image
    if (!message || !message.attachments || message.attachments.length === 0) {
      sendMessage(senderId, { text: "Usage: Reply to an image with your question." }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }

    const imageUrl = message.attachments[0].url; // Assuming the first attachment is the image
    const question = args.join(' '); // The rest is the question

    if (question === "") {
      sendMessage(senderId, { text: "Please provide a question along with the image." }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: '🤖 Analyzing image, please wait...' }, pageAccessToken);

    try {
      // Retrieve previous context for the user, if available
      const previousContext = userContext[senderId] || '';
      const fullQuestion = `${previousContext} ${question}`.trim();

      // Construct the API URL for the Pixtral API call
      const apiUrl = `https://api.kenliejugarap.com/pixtral-paid/?question=${encodeURIComponent(fullQuestion)}&image_url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);

      // Extract the result from the response
      const result = response.data.result;

      // Send the generated text to the user with proper concatenation
      sendMessage(senderId, { text: "🤖 Pixtral AI:\n\n" + result }, pageAccessToken);

      // Update the user context with the new question and response for future interactions
      userContext[senderId] = `${fullQuestion}\n${result}`;

    } catch (error) {
      console.error('Error calling Pixtral API:', error);
      sendMessage(senderId, { text: 'There was an error analyzing the image. Please try again later.' }, pageAccessToken);
    }
  }
};
