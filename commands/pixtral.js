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

    const imageUrl = args[0]; // Assume the image URL is the first argument

    try {
      // Notify user that the image analysis is in progress
      sendMessage(senderId, { text: 'Analyzing your image, please wait...' }, pageAccessToken);

      // Build the Pixtral API URL with encoded image URL
      const apiUrl = `https://api.kenliejugarap.com/pixtral-paid/?question=what%20is%20this%20image%20that%20i%20give&image_url=${encodeURIComponent(imageUrl)}`;

      // Make the API call and specify GET method
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_API_KEY_HERE' // Uncomment if API requires a key
        }
      });

      if (!response.ok) {
        // Log error details if response is not OK
        const errorText = await response.text();
        console.error('API response error:', errorText);
        return sendMessage(senderId, { text: 'The Pixtral API returned an error. Please check the URL or try again later.' }, pageAccessToken);
      }

      const data = await response.json();

      // Check for description in the API response
      const message = data.description || 'No description available for this image.';
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Pixtral API:', error);
      sendMessage(senderId, { text: 'There was an error processing your request. Please check the image URL or try again later.' }, pageAccessToken);
    }
  }
};
