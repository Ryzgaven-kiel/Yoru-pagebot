const axios = require('axios');

// Define and export the command for Pagebot
module.exports = {
    name: "misteal",
    description: "Ask questions and receive answers using the Misteal AI model.",
    usage: "misteal <your question>",
    author: "Your Name",
    version: "1.0.0",
    hasPermission: 0,
    commandCategory: "AI",
    cooldowns: 5,

    // Main function that executes the command
    async execute(senderId, args, pageAccessToken) {
        // Check if a question is provided
        if (!args || args.length === 0) {
            // Send a message requesting a question if missing
            await sendMessage(senderId, {
                text: '❌ Please provide a question to ask Misteal.\n\nUsage: misteal <your question>'
            }, pageAccessToken);
            return; // Exit the function if no question is provided
        }

        // Join arguments to form the question and URL-encode it
        const question = encodeURIComponent(args.join(' '));
        const apiUrl = `https://api.kenliejugarap.com/mistral/?question=${question}`;

        // Notify the user that the answer is being fetched
        await sendMessage(senderId, { text: '⌛ Generating answer, please wait...' }, pageAccessToken);

        try {
            // Send the request to the API
            const response = await axios.get(apiUrl);

            // Check if the response contains the expected data
            if (response.data && response.data.answer) {
                const answer = response.data.answer;

                // Send the generated answer back to the user
                await sendMessage(senderId, {
                    text: `🤖 Misteal Answer:\n\n${answer}`
                }, pageAccessToken);
            } else {
                console.error('API response did not contain expected data:', response.data);

                // Notify user if the response data is unexpected
                await sendMessage(senderId, {
                    text: '❌ An error occurred while retrieving the answer. Please try again later.'
                }, pageAccessToken);
            }
        } catch (error) {
            console.error('Error fetching answer from Misteal API:', error);

            // Notify user of the error
            await sendMessage(senderId, {
                text: '❌ There was an error processing your request. Please try again later.'
            }, pageAccessToken);
        }
    }
};

// Helper function for sending messages
async function sendMessage(senderId, message, pageAccessToken) {
    try {
        // Logic to send a message through the Pagebot API or Messenger API
        await axios.post(
            `https://graph.facebook.com/v14.0/me/messages?access_token=${pageAccessToken}`,
            {
                recipient: { id: senderId },
                message: message
            }
        );
    } catch (error) {
        console.error('Error sending message:', error);
    }
                              }
