module.exports = {
  name: 'stalk',
  description: 'Generates simulated information about a Facebook user based on their profile link.',
  author: 'ChatGPT',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const profileLink = args.join(' ').trim();

    // Check if a valid Facebook profile link was provided
    const fbUsernameMatch = profileLink.match(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9.]+)/);
    if (!fbUsernameMatch) {
      return sendMessage(senderId, { text: 'Please provide a valid Facebook profile link.' }, pageAccessToken);
    }

    // Extract the username from the URL
    const username = fbUsernameMatch[1];

    // Simulated user data
    const fakeUserData = {
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} Johnson`,
      bio: 'An adventurous soul sharing life’s moments!',
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
