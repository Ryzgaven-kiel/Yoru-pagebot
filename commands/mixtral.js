const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'mixtral',
  description: 'Answers questions using the Ministral AI model.',
  usage: 'mixtral <question>',
  author: 'cristian',

  async execute(senderId, args, pageAccessToken) {
    // Check if a question is provided
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '❌ Please provide a question to ask.\n\nUsage: mixtral <your question>'
      }, pageAccessToken);
      return;
    }

    // Join the arguments to form the question
    const question = args.join(' ');
    const apiUrl = `https://api.kenliejugarap.com/ministral-3b-paid/?question=${encodeURIComponent(question)}`;

    // Notify user that the answer is being fetched
    await sendMessage(senderId, { text: '⌛ Generating answer, please wait...' }, pageAccessToken);

    try {
      // Make the API request
      const response = await axios.get(apiUrl);

      // Check if a valid response is received
      if (response.data && response.data.answer) {
        const answer = response.data.answer;

        // Send the answer back to the user
        await sendMessage(senderId, {
          text: `🤖 Mixtral Answer:\n\n${answer}`
        }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        await sendMessage(senderId, {
          text: '❌ An error occurred while retrieving the answer. Please try again later.'
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching answer from Mixtral API:', error);

      // Notify the user of the error
      await sendMessage(senderId, {
        text: '❌ There was an error processing your request. Please try again later.'
      }, pageAccessToken);
    }
  }
};
        
