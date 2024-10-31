module.exports = {
  name: 'confess',
  description: 'Confess something about a user using their profile link.',
  author: 'Cristian',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const profileLink = args[0]; // Expecting the first argument to be the profile link
    const confession = args.slice(1).join(' '); // The rest of the args will be the confession text

    if (!profileLink || !confession) {
      return sendMessage(senderId, { text: 'Please provide a profile link and your confession.' }, pageAccessToken);
    }

    // You can customize the response format
    const responseMessage = `💬 Confession about [User](${profileLink}): ${confession}`;

    // Send the confession message
    sendMessage(senderId, { text: responseMessage }, pageAccessToken);
  }
};
