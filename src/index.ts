import express from "express";
import { BotClass } from "./bot";
const app = express();
const port = 3000;
const mamCulBot = new BotClass();

mamCulBot.start();

app.get("/play", (req, res) => {
  res.send({ message: "Bot play" });
  mamCulBot.playRandomSoundInRandomChannel();
});
app.get("/pum", async (req, res) => {
  res.send({ message: "Bot play Granade" });
  const data = await mamCulBot.getGuildVoiceChanel();

  mamCulBot.playSound({
    channel: data.channel,
    guild: data.guild,
    sound: "boom",
  });
});

app.get("/", (req, res) => {
  res.send({ message: "Bot arriba" });
});

app.listen(port, () => {});

setInterval(async () => {
  try {
    const res = await fetch("https://dsadas-d37k.onrender.com/");

    await res.json();

    console.log("Se ha realizado la Hidratación");
  } catch (err) {
    console.log(err);
  }
}, 1000 * 60 * 10);
