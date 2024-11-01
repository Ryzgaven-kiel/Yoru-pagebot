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
const pageAccessToken = "EAAYclADcUXcBO0n5QI9kaHZBwigRwCQlDx56sdanpSwIG7k9xwqPgEsOigkwT1e4Q5vMwApViIR5U6EovjOyk4Xu1IJ2ukAwVOCeZAwTzwaEpQm3fDaYyp4dQip8OZCMZCUocGsN8G7VyyZB6roSeBQzTL9WUCcMDFZCTDZCpIg12jYPJkyMVjY3BaYaQelmzsIZBgZDZD"; // Replace with actual token
const pageId = "494294333758363"; // Replace with actual page ID

module.exports.execute(prompt, pageAccessToken, pageId);
