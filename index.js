require("dotenv").config({ path: "./slacker.env" });
const axios = require("axios");
const { App } = require("@slack/bolt");
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});
app.command("/slacker-int", async ({ command, ack, respond })=> {
    await ack;
    await respond({ text: `I dont wanna. fine. im slacker. every command of mine has a 74 percent chance of doing something. except this intro. now piss off.` });
});
app.command("/slacker-joke", async ({ ack, respond }) => {
  await ack();
  if (Math.random() > 0.74) {
    return;
  }
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup} ${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
(async () => {
    await app.start();
    console.log("bot is running!");
})();