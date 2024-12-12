const { Client, GatewayIntentBits, Events } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const path = require("path");

const userSounds = {
  //   "drobbe.": "elio.mp3", // Reemplaza USER_ID_1 con el ID del usuario
  //   hunterobot: "kratek.mp3", // Otro usuario más
  "⎝kratek ᵛᵉ⎠": "kratek.mp3", // Otro usuario
  gastaclaux: "elio.mp3", // Otro usuario más
  sazerac: "campanas.mp3", // Otro usuario más
};

const client = new Client({
  intents: 53608447,
});

client.on("ready", async () => {
  console.log(`Encendido como ${client.user.username}`);
});

client.login(process.env.TOKEN_GG);

client.on(Events.MessageCreate, async (message) => {
  console.log(message.content);
  if (message.content === "ping") {
    message.reply("pong");
  }
});

client.on(Events.MessageCreate, async (message) => {
  console.log(message.content);
  if (message.content === "hola") {
    message.reply("Buenos dias");
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  // Check if a member joined a voice channel
  // Verifica si alguien se unió a un canal de voz

  if (!oldState.channel && newState.channel) {
    const userTag = newState.member.user.tag;

    console.log(`${userTag} joined a voice channel.`);

    const sound = userSounds[userTag];

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