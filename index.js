const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = 'pagebot'; // Your verification token
const PAGE_ACCESS_TOKEN = fs.readFileSync('token.txt', 'utf8').trim(); // Read the page access token from file

// Webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge); // Respond with the challenge token
    } else {
      res.sendStatus(403); // Forbidden
    }
  }
});

// Handle incoming messages and postbacks
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          // Check if the message contains an image
          if (event.message.attachments && event.message.attachments.length > 0) {
            const attachment = event.message.attachments[0];
            // Process the message with an image
            handleMessage(event, PAGE_ACCESS_TOKEN);
          } else if (event.message.text) {
            // Process text messages
            handleMessage(event, PAGE_ACCESS_TOKEN);
          }
        } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED'); // Acknowledge the event
  } else {
    res.sendStatus(404); // Not found
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
         
