const fetch = require('node-fetch');

module.exports = {
  name: 'openai',
  description: 'Ask a question using the FreeGPT API by Kenlie Jugarap',
  author: 'Cristian',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Join the arguments to form the question
    const question = args.join(' ');

    // Check if the question is empty
    if (!question) {
      return sendMessage(senderId, { text: 'Please provide a question after the "openai" command.' }, pageAccessToken);
    }

    try {
      // Notify user that the request is being processed
      sendMessage(senderId, { text: '🤖 Thinking...' }, pageAccessToken);

      // Build the API URL with the question
      const apiUrl = `https://api.kenliejugarap.com/freegpt-openai/?question=${encodeURIComponent(question)}`;

      // Make the API request
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Log the error details if response is not OK
        const errorText = await response.text();
        console.error('API response error:', errorText);
        return sendMessage(senderId, { text: 'The OpenAI API returned an error. Please try again later.' }, pageAccessToken);
      }

      // Parse the response JSON
      const data = await response.json();

      // Extract the response text from the API
      const message = data.answer || 'No answer available for your question.';
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      sendMessage(senderId, { text: 'There was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};
