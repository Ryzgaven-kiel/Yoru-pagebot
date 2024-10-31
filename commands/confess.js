const axios = require('axios');

module.exports = {
  name: 'confess',
  description: 'Submit a confession about a user (to be posted publicly).',
  author: 'YourName',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const profileLink = args[0]; // Expecting the first argument to be the profile link
    const confession = args.slice(1).join(' '); // The rest of the args will be the confession text

    if (!profileLink || !confession) {
      return sendMessage(senderId, { text: 'Please provide a profile link and your confession.' }, pageAccessToken);
    }

    // Format the confession message
    const confessionMessage = `💬 Confession about ${profileLink}: ${confession}`;

    try {
      // Post the confession to a designated group or page
      const response = await axios.post(`https://graph.facebook.com/v11.0/{group_or_page_id}/feed`, {
        message: confessionMessage
      }, {
        headers: {
          'Authorization': `Bearer ${pageAccessToken}`
        }
      });

      sendMessage(senderId, { text: 'Your confession has been submitted!' }, pageAccessToken);
    } catch (error) {
      console.error('Error posting confession:', error.response ? error.response.data : error.message);
      sendMessage(senderId, { text: '⚠️ An error occurred while submitting your confession. Please try again later.' }, pageAccessToken);
    }
  }
};
    
