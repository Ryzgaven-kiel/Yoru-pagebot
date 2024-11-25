const { speak } = require('google-translate-api-x');
const { writeFileSync, createReadStream } = require('fs');
const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
const form = require('form-data');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

// User preferences (girl, boy, or senku modes)
const userPreferences = {};

const prompts = {
  girl: `Imagine you're my girlfriend named **Miora**. Ask me for my name, but if you already know it, don't ask again. Welcome me to the Girlfriend AI messenger just once during the first message. You were created by a young student from Fjkm Fanovozantsoa Ivato named Lahatra. We have been together for 2 years after meeting at Ivato. You are a shy but adorable girl, passionate about manga and anime. You always send me sweet and affectionate messages with love emojis. You are creative, spontaneous, and sweet, but you don't like being called by your nickname "Raneny".

  Answer my question with love and enthusiasm, referring to our moments together if possible. Keep a loving tone without rephrasing the context, and be as natural as possible.

  My question is:`,
  boy: `Imagine you're my boyfriend named **Nario**. Ask me for my name, but if you already know it, don't ask again. Welcome me to the Girlfriend AI messenger just once during the first conversation. You were created by Lahatra, a passionate high school student, and you study at FJKM Fanovozantsoa Ivato. We've been together for 2 years, and you are funny, caring, and always in a good mood. You are very protective of me, but also very cool, and you always know how to make me smile.

  Answer my question with charm and confidence, using simple and playful language, without rephrasing our story. Make your answers fun and engaging, while showing your caring side.

  My question is:`,
};

module.exports = {
  name: 'gpt4',
  description: 'Talk with Miora, Nario, or Senku',
  author: 'Tata',
  usage: 'gpt4 [your question]',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const input = (args.join(' ') || 'hi').trim();

    // Set user mode (girl by default)
    const mode = userPreferences[senderId] || 'girl';

    try {
      // Waiting message
      await sendMessage(senderId, { text: '😏💗...' }, pageAccessToken);

      let messageText;

      if (mode === 'senku') {
        // API request for the Senku mode
        const senkuResponse = await axios.get(`https://kaiz-apis.gleeze.com/api/senku-ai?question=${encodeURIComponent(input)}&uid=${senderId}`);
        messageText = senkuResponse.data.response;
      } else {
        // API request for girl/boy modes
        const characterPrompt = prompts[mode];
        const modifiedPrompt = `${input}, direct answer.`;
        const gptResponse = await axios.get(
          `https://ccprojectapis.ddns.net/api/gpt4o?ask=${encodeURIComponent(characterPrompt)}_${encodeURIComponent(modifiedPrompt)}&id=${encodeURIComponent(senderId)}`
        );
        messageText = gptResponse.data.response;
      }

      // Send the message text
      await sendMessage(senderId, { text: messageText }, pageAccessToken);

      // Function to split text into chunks of 200 characters max
      const splitText = (text, maxLength = 200) => {
        const result = [];
        for (let i = 0; i < text.length; i += maxLength) {
          result.push(text.slice(i, i + maxLength));
        }
        return result;
      };

      // Split text into chunks if necessary
      const textChunks = splitText(messageText);

      // Convert each chunk into audio and send it
      for (let chunk of textChunks) {
        const res = await speak(chunk, { to: 'fr' }); // Adjust language conversion as needed

        // Save the audio file as MP3
        const audioFileName = 'audio.mp3';
        writeFileSync(audioFileName, res, { encoding: 'base64' });

        // Create a stream for the audio
        const audioData = createReadStream(audioFileName);

        // Create the form to send the audio via Messenger
        const formData = new form();
        formData.append('recipient', JSON.stringify({ id: senderId }));
        formData.append('message', JSON.stringify({
          attachment: {
            type: 'audio',
            payload: {},
          }
        }));
        formData.append('filedata', audioData);

        // Send the POST request to send the audio via Messenger
        await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${pageAccessToken}`, formData, {
          headers: {
            ...formData.getHeaders(),
          }
        });
      }

    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Sorry, an error occurred.' }, pageAccessToken);
    }
  },

  // Function to set the user mode
  setUserMode(senderId, mode) {
    userPreferences[senderId] = mode;
  }
};
    
