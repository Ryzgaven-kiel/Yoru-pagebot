// Export the module
module.exports = {
  name: 'greet', // Command name
  description: 'Responds to greetings and introduces Yoru Bot.',
  author: 'Your Name',

  async execute(senderId, messageText, pageAccessToken, sendMessage) {
    // Define greeting keywords to match
    const greetings = ["hi", "Hi", "HI", "hello", "hai"];
    
    // Check if the message text includes any greeting keyword
    if (greetings.includes(messageText.trim())) {
      // Randomize friendly greeting response
      const responses = [
        "Hey there! I'm Yoru Bot. Let me introduce myself!",
        "Hello! I'm Yoru Bot, your AI companion. 😊",
        "Hi! I'm here to help you out with all kinds of things. Let me show you what I can do!",
        "Hello! Nice to meet you. I'm Yoru Bot, and I've got some great commands for you!"
      ];
      const randomGreeting = responses[Math.floor(Math.random() * responses.length)];

      // Send greeting response
      await sendMessage(senderId, { text: randomGreeting }, pageAccessToken);

      // Introduce Yoru Bot's commands
      const introductionText = `
        Here’s what I can do:
        🧠 **Yoru Command** - Ask me anything with \`yoru\` + your question. Example: \`yoru what is life?\`
        🎨 **Bing Command** - Generate an image with \`bing\`. Example: \`bing cat holding a spoon\`
        🖼️ **Art Command** - Send a single image with \`art\`. Example: \`art cats\`
        📌 **Gmage Command** - Get a collection of 5 images with \`gmage\`. Example: \`gmage dogs\`
        🎶 **Spotify Command** - Hear songs via voice with \`spotify\`. Example: \`spotify sining\`
        📝 **Lyrics Command** - Get lyrics with \`lyrics\`. Example: \`lyrics sining\`
        🎭 **Emojimix Command** - Combine emojis with \`emojimix\`. Just send two emojis together!

        Type any of these commands, and I’ll take it from there!
      `;

      // Send command introduction
      await sendMessage(senderId, { text: introductionText }, pageAccessToken);
    }
  }
};
