const axios = require("axios");
const name = "yoruai" ;

module.exports = {
  name,
  description: "Interact with Yoru Bot",
  async run ({ api, event, send, args }){
    const prompt = args.join(" ");
    if (!prompt) return send(`Please enter your question! 

Example: ${name} what is love?`);
    send("Please wait... 🔎");
    try {
    const gpt = await axios.get(`${api.api_josh}/api/gpt-4o`, {
      params: {
        q: prompt,
        uid: event.sender.id
      }
    });
    if (!gpt || !gpt.data.status)
    throw new Error();
    send(`${gpt.data.result}

🤖 Yoru Bot by Cristian M. Serrano`);
    } catch(err){
      send(err.message || err);
      return;
    }
  }
}