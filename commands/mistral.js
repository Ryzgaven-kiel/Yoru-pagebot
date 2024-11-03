const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Simulated database for user context (could be replaced with a real database)
const userContext = {};

module.exports = {
  name: 'mistral',
  description: 'Analyze an image using the Mistral API',
  author: 'your_name', // Update with your name or desired author
  async execute(senderId, args, pageAccessToken, message) {
    // Log the incoming message for debugging
    console.log("Incoming message:", message);

    // Check if the message contains an image attachment
    const attachments = message.message && message.message.attachments ? message.message.attachments : null;
    if (!attachments || attachments.length === 0) {
      sendMessage(senderId, { text: "Usage: Reply to an image with your question." }, pageAccessToken);
      return; // Exit if no attachments
    }

    const imageUrl = attachments[0].payload.url; // Access the URL of the first attachment
    const question = args.join(' '); // Join the args to form the question

    if (question === "") {
      sendMessage(senderId, { text: "Please provide a question along with the image." }, pageAccessToken);
      return; // Exit if no question
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: '🤖 Analyzing image, please wait...' }, pageAccessToken);

    try {
      // Log the image URL and question for debugging
      console.log(`Image URL: ${imageUrl}`);
      console.log(`Question: ${question}`);

      // Retrieve previous context for the user, if available
      const previousContext = userContext[senderId] || '';
      const fullQuestion = `${previousContext} ${question}`.trim();

      // Construct the API URL for the Mistral API call
      const apiUrl = `https://api.kenliejugarap.com/mistral-large-paid/?question=${encodeURIComponent(fullQuestion)}`;

      // Log the API URL to check for correctness
      console.log(`API URL: ${apiUrl}`);

      const response = await axios.get(apiUrl);
      // Log the response from the API for debugging
      console.log("API Response:", response.data);

      // Extract the result from the response
      const result = response.data.result;

      // Send the generated text to the user with proper formatting
      sendMessage(senderId, { text: "🤖 Mistral AI:\n\n" + result }, pageAccessToken);

      // Update the user context with the new question and response for future interactions
      userContext[senderId] = `${fullQuestion}\n${result}`;

    } catch (error) {
      console.error('Error calling Mistral API:', error);
      sendMessage(senderId, { text: '⚠️ Oops! An error occurred while processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};
                           
