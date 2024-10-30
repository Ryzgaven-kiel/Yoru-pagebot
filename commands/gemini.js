const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const canvas = require('canvas');

// Load the model
async function loadModel() {
  return await mobilenet.load();
}

// Load an image and convert it to a tensor
async function loadImage(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const canvasInstance = canvas.createCanvas(img.width, img.height);
  const ctx = canvasInstance.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return tf.browser.fromPixels(canvasInstance);
}

// Classify the image
async function classifyImage(imagePath) {
  const model = await loadModel();
  const imageTensor = await loadImage(imagePath);
  
  const predictions = await model.classify(imageTensor);
  return predictions;
}

// PageBot command
module.exports = {
  name: 'gemini',
  description: 'Describe an image sent by the user.',
  author: 'Cristian', // Replace with the actual author's name
  async execute(message) {
    const attachments = message.attachments;
    
    if (attachments.length === 0) {
      return message.reply('Please send an image to classify.');
    }

    const imageUrl = attachments[0].url; // Get the first image attachment

    try {
      const predictions = await classifyImage(imageUrl);
      const description = predictions
        .map(prediction => `${prediction.className} (${(prediction.probability * 100).toFixed(2)}%)`)
        .join(', ');
      
      await message.reply(`I see: ${description}`);
    } catch (error) {
      console.error('Error classifying image:', error);
      await message.reply('Sorry, I could not identify the image.');
    }
  }
};
    
