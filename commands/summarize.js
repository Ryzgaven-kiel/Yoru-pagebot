const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'summarize',
  description: 'summarize your long text',
  usage: 'summarize [text here]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: humanizer Your AI-generated text here" }, pageAccessToken);

    try {
       const { data } = await axios.get(`https://kaiz-apis.gleeze.com/api/summarize?text=${encodeURIComponent(prompt)}`);
      
      sendMessage(senderId, { text: data.response }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
