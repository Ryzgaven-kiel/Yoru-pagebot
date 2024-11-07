const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "ngl",
  description: "Send a message using user",
  author: "Jay Mar",
  role: 1,

  async execute(senderId, args, pageAccessToken) {
    const nglusername = args[0];
    const message = args.slice(1, -1).join(' ');
    const amount = parseInt(args[args.length - 1], 10); 

    if (!nglusername || !message || isNaN(amount)) {
      return sendMessage(senderId, { text: "Invalid command format. Please use ngl [username] [message] [amount]" }, pageAccessToken);
    }

    try {
      const headers = {
        'referer': `https://ngl.link/${nglusername}`,
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      };

      const data = {
        'username': nglusername,
        'question': message,
        'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
        'gameSlug': '',
        'referrer': '',
      };

      for (let i = 0; i < amount; i++) {
        await axios.post('https://ngl.link/api/submit', data, { headers });
        console.log(`[+] Sent message ${i + 1} to ${nglusername}`);
      }

      await sendMessage(senderId, { text: `Successfully sent ${amount} message(s) to ${nglusername} through ngl.link.` }, pageAccessToken);
    } catch (error) {
      console.error('Error sending message through ngl.link:', error);
      await sendMessage(senderId, { text: "An error occurred while sending the message through ngl.link." }, pageAccessToken);
    }
  }
};

        
