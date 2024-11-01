const axios = require('axios');

// List of authorized admin UIDs
const adminUIDs = ['100088350665764', '100051157809614']; // Replace with actual admin UIDs

module.exports = {
  name: 'post',
  description: 'Automatically post a message to Facebook based on admin’s prompt',
  author: 'Your Name',

  async execute(senderId, prompt, pageAccessToken, pageId) {
    // Check if the sender is an authorized admin
    if (!adminUIDs.includes(senderId)) {
      console.log(`Unauthorized attempt by user ID: ${senderId}`);
      return console.error("Access denied. Only admins can post to Facebook.");
    }

    try {
      // Log the prompt to show what will be posted
      console.log(`Admin prompt received from UID ${senderId}: ${prompt}`);

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
const senderId = "123456789"; // Replace with the actual sender UID
const prompt = "Hello Facebook! This is an automated post based on the admin's prompt.";
const pageAccessToken = "EAAYclADcUXcBO0n5QI9kaHZBwigRwCQlDx56sdanpSwIG7k9xwqPgEsOigkwT1e4Q5vMwApViIR5U6EovjOyk4Xu1IJ2ukAwVOCeZAwTzwaEpQm3fDa
  
