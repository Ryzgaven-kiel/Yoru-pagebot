const tf = require('@tensorflow/tfjs-node'); // Node version of TensorFlow
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
  author: 'Your Name', // Replace with your actual name

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Please send an image to classify.' }, pageAccessToken);
    }

    const imageUrl = args[0]; // Assuming the user sends the image URL as an argument

    try {
      const predictions = await classifyImage(imageUrl);
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
