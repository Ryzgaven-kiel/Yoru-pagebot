const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const { createCanvas, loadImage } = require('canvas');

async function loadModel() {
  return await mobilenet.load();
}

async function imageToTensor(imageUrl) {
  const img = await loadImage(imageUrl);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return tf.browser.fromPixels(canvas);
}

async function classifyImage(imageUrl) {
  const model = await loadModel();
  const imageTensor = await imageToTensor(imageUrl);

  const predictions = await model.classify(imageTensor);
  return predictions;
}

module.exports = {
  name: 'gemini',
  description: 'Describe an image sent by the user.',
  author: 'Cristian',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Please send an image URL.' }, pageAccessToken);
    }

    const imageUrl = args[0];

    try {
      // Log the image URL for debugging
      console.log('Classifying image:', imageUrl);

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
        
