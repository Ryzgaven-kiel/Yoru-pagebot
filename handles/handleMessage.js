const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const prefix = '-';

// Load command modules
fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) {
    console.error('Invalid event object: Missing sender ID');
    return;
  }

  const messageText = event?.message?.text?.trim();
  if (!messageText) {
    console.log('Received event without message text');
    return;
  }

  // Check for reply_to property if needed
  const replyTo = event?.message?.reply_to;

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');

  try {
    if (commands.has(commandName.toLowerCase())) {
      // Handle command
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage, replyTo);
    } else {
      // Default to 'gpt4' command if not found
      await commands.get('gpt4').execute(senderId, [messageText], pageAccessToken, sendMessage, replyTo);
    }
  } catch (error) {
    console.error('Error executing command:', error);
    await sendMessage(senderId, { text: error.message || 'There was an error executing that command.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
