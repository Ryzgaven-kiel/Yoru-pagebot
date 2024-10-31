// In-memory storage for simplicity. Replace with a database for persistence.
const customResponses = {};

module.exports = {
  // `teach` Command to add new responses
  teach: {
    name: 'teach',
    description: 'Teaches the bot a new response for a specific prompt.',
    author: 'ChatGPT',

    async execute(senderId, args, pageAccessToken, sendMessage) {
      const input = args.join(' ').trim();

      // Expect format "prompt | response"
      const [prompt, response] = input.split('|').map(item => item.trim());

      if (!prompt || !response) {
        return sendMessage(senderId, { text: 'Please provide a prompt and response in the format: "prompt | response".' }, pageAccessToken);
      }

      // Save the custom response
      customResponses[prompt.toLowerCase()] = response;
      sendMessage(senderId, { text: `Got it! I'll respond with "${response}" whenever I hear "${prompt}".` }, pageAccessToken);
    }
  }
