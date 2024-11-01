const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

class BlackboxAI {
  constructor() {
    this.apiUrl = 'https://cristian-api.onrender.com/api/blackbox'; // Updated API URL
  }

  async sendMessage(text, conversationId, model) {
    const apiUrl = `${this.apiUrl}?text=${encodeURIComponent(text)}&conversationId=${conversationId}&model=${model}`;
    
    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        throw new Error('There was an error generating the response. Please try again later.');
      }
    } catch (error) {
      console.error('Error communicating with Blackbox AI:', error);
      throw new Error('There was an error generating the response. Please try again later.');
    }
  }
}

// Initialize BlackboxAI
const blackboxAI = new BlackboxAI();

// Define the command and the API endpoint
app.get('/api/chat', async (req, res) => {
  const { text, conversationId, model } = req.query;

  // Validate the required parameters
  if (!text || !conversationId || !model) {
    return res.status(400).json({ error: 'Text, conversationId, and model are required' });
  }

  try {
    const response = await blackboxAI.sendMessage(text, conversationId, model);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Command structure to execute Blackbox AI
const command = {
  name: 'blackbox',
  description: 'Interact with the Blackbox AI chat model',
  execute: async (text, conversationId, model) => {
    const response = await blackboxAI.sendMessage(text, conversationId, model);
    return response;
  }
};

// Example command execution (this part is just to illustrate how you might use the command)
app.get('/api/executeCommand', async (req, res) => {
  const { text, conversationId, model } = req.query;
  
  try {
    const commandResponse = await command.execute(text, conversationId, model);
    res.json({ commandResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
    
