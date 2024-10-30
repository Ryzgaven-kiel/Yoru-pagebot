const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const { createCanvas, loadImage } = require('canvas');

// Load the MobileNet model
async function loadModel() {
  return await mobilenet.load();
}

// Convert an image URL to a tensor
async function imageToTensor(imageUrl) {
  const img = await loadImage(imageUrl);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return tf.browser.fromPixels(canvas);
}

// Classify the image
async function classifyImage(imageUrl) {
  const model = await loadModel();
  const imageTensor = await imageToTensor(imageUrl);
  
  const predictions = await model.classify(imageTensor);
  return predictions;
}

// PageBot command
module.exports = {
  name: 'gemini',
  description: 'Describe an image sent by the user.',
  author: 'Your Name', // Replace with the actual author's name

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
