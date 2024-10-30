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
  name: 'yoru',
  description: 'Recognize objects in an image',
  author: 'ChatGPT',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      return sendMessage(senderId, { text: 'Please provide an image URL.' }, pageAccessToken);
    }

    const imageUrl = args[0];

    try {
      // Classify the image
      const predictions = await classifyImage(imageUrl);
      const description = predictions
        .map(prediction => `${prediction.className} (${(prediction.probability * 100).toFixed(2)}%)`)
        .join(', ');

      // Send the classification results
      await sendMessage(senderId, { text: `I see: ${description}` }, pageAccessToken);
    } catch (error) {
      console.error('Error classifying image:', error);
      sendMessage(senderId, { text: '⚠️ An error occurred while processing the image. Please try again later.' }, pageAccessToken);
    }
  }
};
