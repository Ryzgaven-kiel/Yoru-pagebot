const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const canvas = require('canvas');
const { sendMessage } = require('../handles/sendMessage'); // Assuming you have this module for sending messages

async function loadModel() {
  return await mobilenet.load();
}

async function loadImage(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const canvasInstance = canvas.createCanvas(img.width, img.height);
  const ctx = canvasInstance.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return tf.browser.fromPixels(canvasInstance);
}

async function classifyImage(imagePath) {
  const model = await loadModel();
  const imageTensor = await loadImage(imagePath);
  
  const predictions = await model.classify(imageTensor);
  return predictions;
}

// Module export
module.exports = {
  name: 'gemini',
  description: 'Describe an image sent by the user.',
  
  async execute(senderId, imagePath, pageAccessToken) {
    try {
      const predictions = await classifyImage(imagePath);
      const description = predictions
        .map(prediction => `${prediction.className} (${(prediction.probability * 100).toFixed(2)}%)`)
        .join(', ');
      
      await sendMessage(senderId, { text: `I see: ${description}` }, pageAccessToken);
    } catch (error) {
      console.error('Error classifying image:', error);
      await sendMessage(senderId, { text: 'Sorry, I could not identify the image.' }, pageAccessToken);
    }
  }
};

// Example usage
// gemini.execute(senderId, './path/to/your/image.jpg', pageAccessToken);
    
