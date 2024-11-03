const fetch = require('node-fetch');

module.exports = {
  name: 'pixtral',
  description: 'Analyze an image using the Pixtral API',
  author: 'Cristian',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Verify that an image URL is provided
    if (!args.length) {
      return sendMessage(senderId, { text: 'Please provide an image URL after the "pixtral" command.' }, pageAccessToken);
    }

    const imageUrl = args[0];  // Assume the image URL is the first argument

    try {
      // Notify user that the image analysis is in progress
      sendMessage(senderId, { text: 'Analyzing your image, please wait...' }, pageAccessToken);

      // Call the Pixtral API directly in this function
      const apiUrl = `https://api.kenliejugarap.com/pixtral-paid/?question=what%20is%20this%20image%20that%20i%20give&image_url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Extract relevant information from the Pixtral API response
      const message = data.description || 'No description available for this image.';
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Pixtral API:', error);
      sendMessage(senderId, { text: 'There was an error processing your request. Please check the image URL or try again later.' }, pageAccessToken);
    }
  }
};
