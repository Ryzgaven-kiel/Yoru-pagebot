const axios = require('axios');

module.exports = {
  name: 'post',
  description: 'Automatically post a message to Facebook based on admin’s prompt',
  author: 'Your Name',

  async execute(prompt, pageAccessToken, pageId) {
    try {
      // Log the prompt to show what will be posted
      console.log(`Admin prompt received: ${prompt}`);

      // Call the Facebook API to post the prompt
      const response = await axios.post(`https://graph.facebook.com/${pageId}/feed`, {
        message: prompt,
        access_token: pageAccessToken,
      });

      console.log("Successfully posted to Facebook:", response.data);
    } catch (error) {
      console.error("Error posting to Facebook:", error.response ? error.response.data : error.message);
    }
  },
};

// Example usage
const prompt = "Hello Facebook! This is an automated post based on the admin's prompt.";
const pageAccessToken = "your_page_access_token"; // Replace with actual token
const pageId = "your_page_id"; // Replace with actual page ID

module.exports.execute(prompt, pageAccessToken, pageId);
