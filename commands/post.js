const axios = require('axios');

// List of authorized admin UIDs (replace with actual admin UIDs)
const adminUIDs = ['100051157809614', '61567908865958'];

module.exports = {
  name: 'post',
  description: 'Automatically post a message to Facebook based on admin’s prompt',
  author: 'Your Name',

  async execute(senderId, prompt, pageAccessToken, pageId) {
    // Debugging - log current sender ID and list of admin UIDs
    console.log("Sender ID:", senderId);
    console.log("Admin UIDs:", adminUIDs);

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
const senderId = "100051157809614"; // Replace with the actual sender UID from adminUIDs
const prompt = "Hello Facebook! This is an automated post based on the admin's prompt.";
const pageAccessToken = "EAAYclADcUXcBO0n5QI9kaHZBwigRwCQlDx56sdanpSwIG7k9xwqPgEsOigkwT1e4Q5vMwApViIR5U6EovjOyk4Xu1IJ2ukAwVOCeZAwTzwaEpQm3fDaYyp4dQip8OZCMZCUocGsN8G7VyyZB6roSeBQzTL9WUCcMDFZCTDZCpIg12jYPJkyMVjY3BaYaQelmzsIZBgZDZD"; // Replace with actual token
const pageId = "494294333758363"; // Replace with actual page ID

module.exports.execute(senderId, prompt, pageAccessToken, pageId);
