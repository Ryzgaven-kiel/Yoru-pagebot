const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = new Map();

// Load the "yoru" and "ai" commands only
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  if (command.name.toLowerCase() === 'yoru' || command.name.toLowerCase() === 'ai') {
    commands.set(command.name.toLowerCase(), command);
  }
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

    // Split the message into words and treat the first word as the command
    const words = messageText.split(' ');
    commandName = words.shift().toLowerCase(); // Get the first word in the message as the potential command
    args = words; // Remaining words will be arguments

    // Respond only to "yoru" or "ai" commands
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

    // If the message doesn't match "yoru" or "ai", we don't do anything.
    console.log('Received message without "yoru" or "ai" command.');
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
    
