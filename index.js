require("dotenv").config({ path: "./slacker.env" });
const axios = require("axios");
const { App } = require("@slack/bolt");
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});
app.command("/slacker-int", async ({ command, ack, respond })=> {
    await ack();
    await respond({ 
        text: `I dont wanna. fine. im slacker. every command of mine has a 74 percent chance of doing something. except this intro. now piss off.`, 
        response_type: "in_channel" 
    });
});
app.command("/slacker-joke", async ({ ack, respond }) => {
  await ack();
  if (Math.random() > 0.50) {
    return;
  }
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup} ${response.data.punchline}`,
      response_type: "in_channel"
    });
  } catch (err) {
    await respond({ 
      text: "Failed to fetch a joke.", 
      response_type: "ephemeral" 
    });
  }
});
app.command("/slacker-help", async ({ ack, respond }) => {
  await ack();
  if (Math.random() > 0.50) {
    return;
  }
  await respond({ 
    text: `Fine. I'll tell you.\n    /slacker-help shows this help message maybe. if i feel like it..\n    /slacker-int introduces me.\n    /slacker-joke might give you a joke. might not.`,
    response_type: "in_channel"
  });
});
app.command("/slacker-fb", async ({ ack, respond, client, command }) => {
  await ack();
  const feedbackText = command.text.trim();
  if (!feedbackText) {
    await respond({ 
      text: "You forgot to actually write feedback, genius. Try `/slacker-fb [your message]`.", 
      response_type: "ephemeral" 
    });
    return;
  }
  try {
    const conversation = await client.conversations.open({
      users: process.env.CREATOR_USER_ID
    });
    await client.chat.postMessage({
      channel: conversation.channel.id,
      text: `New feedback from <@${command.user_id}>: "${feedbackText}"`
    });
    await respond({ 
      text: "Fine, I sent your precious feedback to my creator. Happy now?", 
      response_type: "in_channel" 
    });
  } catch (err) {
    console.error("DETAILED SLACK ERROR:", err.data || err);
    await respond({ 
      text: `Failed to send feedback. Error: ${err.data?.error || err.message}`, 
      response_type: "ephemeral" 
    });
  }
});
(async () => {
    await app.start();
    console.log("bot is running!");
})();