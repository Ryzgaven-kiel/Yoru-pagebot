const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "mixtral",
  version: "1.0.0",
  hasPermission: 0,
  credits: "nones",
  description: "GPT architecture",
  usePrefix: false,
  commandCategory: "GPT4",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { messageID, messageReply, threadID } = event;
    let prompt = args.join(" ");

    // Combine reply message with args if present
    if (messageReply) {
      const repliedMessage = messageReply.body;
      prompt = `${repliedMessage} ${prompt}`;
    }

    // Check if the prompt is empty
    if (!prompt) {
      return api.sendMessage(
        "🐱 Hello, I am Mixtral trained by Google. How may I assist you today?",
        threadID,
        messageID
      );
    }

    // Inform the user that Mixtral is processing
    api.sendMessage("🗨️ | Mixtral is searching, please wait...", threadID);

    // Add a delay for user experience
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Call the API with the provided prompt
    const gpt4_api = `https://jerai.onrender.com/chat?query=${encodeURIComponent(prompt)}&model=mixtral`;
    const response = await axios.get(gpt4_api);

    // Get current date and time in Manila timezone
    const manilaTime = moment.tz("Asia/Manila").format("MMMM D, YYYY h:mm A");

    // Handle API response
    if (response.data && response.data.message) {
      const generatedText = response.data.message;
      api.sendMessage(
        `🎓 Mixtral (AI) Answer\n━━━━━━━━━━━━━━━━\n\n🖋️ Ask: '${prompt}'\n\nAnswer: ${generatedText}\n\n🗓️ Date & Time:\n.⋅ ۵ ${manilaTime} ۵ ⋅.\n\n━━━━━━━━━━━━━━━━`,
        threadID,
        messageID
      );
    } else {
      console.error("API response did not contain expected data:", response.data);
      api.sendMessage(
        `❌ An error occurred while generating the text response. Please try again later.`,
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
          
