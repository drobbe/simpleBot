import { Client, Events } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import path from "path";
const __dirname = path.resolve();

export class BotClass {
  userSounds = {
    "drobbe.": "test.mp3", // Reemplaza USER_ID_1 con el ID del usuario
    hunterobot: "venao.mp3", // Otro usuario más
    "⎝kratek ᵛᵉ⎠": "kratek.mp3", // Otro usuario
    gastaclaux: "elio.mp3", // Otro usuario más
    sazecj: "campanas.mp3", // Otro usuario más
    ceradrix: "tutienes.mp3", // Otro usuario más
    alexkiller5115: "mate.mp3", // Otro usuario más
  };

  constructor() {
    this.client = new Client({
      intents: 53608447,
    });
  }

  start() {
    this.client.login(process.env.TOKEN_GG);
    this.listenEvents();
  }

  listenEvents() {
    this.client.on("ready", async () => {
      console.log(`Encendido como ${this.client.user.username}`);
    });

    this.client.on(Events.MessageCreate, async (message) => {
      console.log(message.content);
      if (message.content === "ping") {
        message.reply("pong");
      }
    });

    this.client.on(Events.MessageCreate, async (message) => {
      console.log(message.content);
      if (message.content === "hola") {
        message.reply("Buenos dias");
      }
    });

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      if (!oldState.channel && newState.channel) {
        const userTag = newState.member.user.tag;

        console.log(`${userTag} joined a voice channel.`);

        const sound = this.userSounds[userTag];

        if (!sound) return;
        try {
          // Unirse al canal de voz
          const connection = joinVoiceChannel({
            channelId: newState.channel.id,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator,
          });

          // Reproducir sonido al estar listo
          connection.once(VoiceConnectionStatus.Ready, () => {
            console.log("Connected to the voice channel!");
            const player = createAudioPlayer();
            const SOUND_PATH = path.join(__dirname, sound);

            const resource = createAudioResource(SOUND_PATH);

            player.play(resource);
            connection.subscribe(player);

            player.on("idle", () => {
              connection.destroy(); // Salir del canal tras reproducir el sonido
            });
          });
        } catch (err) {
          console.error("Error connecting to the voice channel:", err);
        }
      }
    });
  }
}
