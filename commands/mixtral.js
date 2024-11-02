const axios = require('axios');

// Define the command for Pagebot
module.exports.config = {
    name: "mixtral",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Your Name",
    description: "Answers questions using the Ministral AI model.",
    commandCategory: "AI",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Check if a question was provided
    if (!args || args.length === 0) {
        api.sendMessage('❌ Please provide a question to ask.\n\nUsage: mixtral <your question>', threadID, messageID);
        return;
    }

    // Join arguments to form the question
    const question = args.join(' ');
    const apiUrl = `https://api.kenliejugarap.com/ministral-3b-paid/?question=${encodeURIComponent(question)}`;

    // Notify the user that the answer is being fetched
    api.sendMessage('⌛ Generating answer, please wait...', threadID, messageID);

    try {
        // Send the request to the API
        const response = await axios.get(apiUrl);

        // Check if the response contains the expected data
        if (response.data && response.data.answer) {
            const answer = response.data.answer;

            // Send the answer back to the user
            api.sendMessage(`🤖 Mixtral Answer:\n\n${answer}`, threadID, messageID);
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage('❌ An error occurred while retrieving the answer. Please try again later.', threadID, messageID);
        }
    } catch (error) {
        console.error('Error fetching answer from Mixtral API:', error);

        // Notify the user of the error
        api.sendMessage('❌ There was an error processing your request. Please try again later.', threadID, messageID);
    }
};
                    
