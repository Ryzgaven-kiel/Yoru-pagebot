
const cristian = {}; // empty object

const cristianData = {};

cristian.addcristian = (senderId, time) => {
   cristianData[senderId] = Date.now() + (time * 1000); // 25 seconds in milliseconds
}


cristian.checkcristian = (senderId, time) => {
  if (cristianData[senderId] && cristianData[senderId] > Date.now()) {
    return true;  // On cooldown
  } else {
    return false; // Not on cooldown
  }
}


module.exports = cristian;
