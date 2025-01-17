import express from "express";
import { BotClass } from "./bot";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send({ message: "Bot arriba" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

setInterval(async () => {
  try {
    const res = await fetch("https://dsadas-d37k.onrender.com/");

    await res.json();

    console.log("Se ha realizado la Hidratación");
  } catch (err) {
    console.log(err);
  }
}, 1000 * 60 * 10);

const mamCulBot = new BotClass();

mamCulBot.start();
