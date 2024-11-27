const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const prefix = '-';  // No longer used in this version, can be removed if not needed

const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name.toLowerCase(), command);
}

async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.sender.id) {
    console.error('Invalid event object');
    return;
  }

  const senderId = event.sender.id;

  // Check if the token is valid (this is a simple console check; for a more robust solution, use the API)
  if (!pageAccessToken) {
    console.error('Invalid page access token');
    return;
  }

  if (event.message && event.message.text) {
    const messageText = event.message.text.trim().toLowerCase();
    let commandName, args;

    // In this version, no prefix is required. We will try to find a suitable command by matching the message text directly.
    const words = messageText.split(' ');
    commandName = words.shift().toLowerCase(); // Get the first word in the message as the potential command
    args = words; // Remaining words will be arguments

    // Check if the message matches a known command
    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      try {
        await command.execute(senderId, args, pageAccessToken, sendMessage);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
      }
      return;
    }

    // You can add custom auto-responses based on specific keywords or phrases
    if (messageText.includes("hello")) {
      sendMessage(senderId, { text: 'Hi there! How can I help you today?' }, pageAccessToken);
      return;
    }

    if (messageText.includes("help")) {
      sendMessage(senderId, { text: 'Here are some commands you can try: [list of commands]' }, pageAccessToken);
      return;
    }

    // Example of auto-trigger based on message content (could be more complex, like regex matching, etc.)
    if (messageText.includes("gemini")) {
      const command = commands.get('gemini');
      if (command) {
        try {
          await command.execute(senderId, args, pageAccessToken, sendMessage);
        } catch (error) {
          console.error('Error processing "gemini" command:', error);
          sendMessage(senderId, { text: 'Failed to process gemini request.' }, pageAccessToken);
        }
      }
      return;
    }

    // If no known command or custom response found, we can choose to send a default reply
    sendMessage(senderId, { text: 'I am not sure what you mean, but I am here to help!' }, pageAccessToken);
  } else if (event.message.attachments) {
    const imageUrl = event.message.attachments[0].payload.url;
    if (imageUrl) {
      const command = commands.get('gemini');
      if (command) {
        try {
          await command.execute(senderId, [imageUrl], pageAccessToken, sendMessage);
        } catch (error) {
          console.error('Error processing image:', error);
          sendMessage(senderId, { text: 'Failed to process image.' }, pageAccessToken);
        }
      }
    }
  } else {
    console.log('Received message without text or attachments');
  }
}

module.exports = { handleMessage };
      
