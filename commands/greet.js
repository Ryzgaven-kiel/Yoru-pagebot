const axios = require('axios');

async function sendGreetingAndIntro(senderId, pageAccessToken, sendMessage) {
  // Randomized friendly greeting message
  const greetings = [
    "Hey there! I'm Yoru Bot. Let me introduce myself!",
    "Hello! I'm Yoru Bot, your AI companion. 😊",
    "Hi! I'm here to help you out with all kinds of things. Let me show you what I can do!",
    "Hello! Nice to meet you. I'm Yoru Bot, and I've got some great commands for you!"
  ];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Send greeting message
  await sendMessage(senderId, { text: randomGreeting }, pageAccessToken);

  // Command introduction message
  const introMessage = `
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

  // Send the command introduction
  await sendMessage(senderId, { text: introMessage }, pageAccessToken);
}

module.exports = {
  async execute(senderId, messageText, pageAccessToken, sendMessage) {
    // Define greeting keywords
    const greetingKeywords = ["hi", "hello", "hai", "hey", "yo"];

    // Check if the message is a greeting
    if (greetingKeywords.includes(messageText.trim().toLowerCase())) {
      await sendGreetingAndIntro(senderId, pageAccessToken, sendMessage);
    }
  }
};
