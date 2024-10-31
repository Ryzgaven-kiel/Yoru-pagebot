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
  },

  // `sim` Command to simulate responses, including custom responses
  sim: {
    name: 'sim',
    description: 'Simulates a response to a given scenario or topic, including custom responses.',
    author: 'ChatGPT',

    async execute(senderId, args, pageAccessToken, sendMessage) {
      const scenario = args.join(' ').trim().toLowerCase();

      // Check for custom response first
      if (customResponses[scenario]) {
        return sendMessage(senderId, { text: customResponses[scenario] }, pageAccessToken);
      }

      // Default responses (can be expanded as needed)
      let response;
      if (scenario.includes('greeting')) {
        response = 'Hello! How can I help you today?';
      } else if (scenario.includes('weather')) {
        response = 'It looks like it’s sunny with a chance of rain. Don’t forget your umbrella!';
      } else if (scenario.includes('joke')) {
        response = 'Why did the scarecrow win an award? Because he was outstanding in his field!';
      } else {
        response = 'I’m not sure how to respond to that scenario, but I’m here to help!';
      }

      sendMessage(senderId, { text: response }, pageAccessToken);
    }
  }
};
