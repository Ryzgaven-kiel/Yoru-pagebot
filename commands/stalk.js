module.exports = {
  name: 'stalk',
  description: 'Generates simulated information about a user.',
  author: 'ChatGPT',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const username = args.join(' ').trim();

    if (!username) {
      return sendMessage(senderId, { text: 'Please provide a username to stalk.' }, pageAccessToken);
    }

    // Simulated user data
    const fakeUserData = {
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} Smith`,
      bio: 'Just a random person living their best life!',
      followers_count: Math.floor(Math.random() * 10000),   // Random follower count
      following_count: Math.floor(Math.random() * 5000),    // Random following count
      post_count: Math.floor(Math.random() * 300)           // Random post count
    };

    const messageText = `
      📜 | Here is some simulated information about ${username}:
      - Full Name: ${fakeUserData.name}
      - Bio: ${fakeUserData.bio}
      - Followers: ${fakeUserData.followers_count}
      - Following: ${fakeUserData.following_count}
      - Posts: ${fakeUserData.post_count}
    `;

    sendMessage(senderId, { text: messageText }, pageAccessToken);
  }
};
