const axios = require("axios");

module.exports.config = {
  name: "mixtral",
  version: "1.1.0",
  hasPermission: 0,
  credits: "nones",
  description: "Advanced GPT architecture with interactive features",
  usePrefix: false,
  commandCategory: "GPT4",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { messageID, messageReply, threadID } = event;
    let prompt = args.join(" ");

    // Combine replied message with args if present
    if (messageReply) {
      const repliedMessage = messageReply.body;
      prompt = `${repliedMessage} ${prompt}`;
    }

    // Provide a default prompt if none is provided
    if (!prompt) {
      return api.sendMessage(
        "🐱 Hello! I am Mixtral, your AI assistant trained by Google. How may I assist you today?",
        threadID,
        messageID
      );
    }

    // Notify the user that Mixtral is processing the request
    api.sendMessage("🗨️ | Mixtral is processing your request, please wait...", threadID);

    // Introduce a delay for user experience
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Call the GPT API with the user's prompt
    const gpt4_api = `https://jerai.onrender.com/chat?query=${encodeURIComponent(prompt)}&model=mixtral`;
    const response = await axios.get(gpt4_api);

    // Check for valid response from API
    if (response.data && response.data.message) {
      const generatedText = response.data.message;
      const currentDateTime = new Date().toLocaleString();

      // Enhance the output with a random trivia fact or joke
      const triviaFacts = [
        "Did you know? Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3000 years old.",
        "Why don't scientists trust atoms? Because they make up everything!",
        "A group of flamingos is called a 'flamboyance.'",
      ];
      const randomTrivia = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];

      // Send the response along with the trivia fact
      api.sendMessage(
        `🎓 Mixtral (AI) Answer\n━━━━━━━━━━━━━━━━\n\n🖋️ **Ask:** '${prompt}'\n\n**Answer:** ${generatedText}\n\n🗓️ **Date & Time:** ${currentDateTime}\n\n🎉 **Fun Fact:** ${randomTrivia}\n\n━━━━━━━━━━━━━━━━`,
        threadID,
        messageID
      );
    } else {
      console.error("API response did not contain expected data:", response.data);
      api.sendMessage(
        `❌ An error occurred while generating the response. Please try again later.`,
        threadID,
        messageID
      );
    }
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage(
      `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
