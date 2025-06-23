import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";

import {
  Channel,
  ChannelType,
  Client,
  Events,
  Guild,
  VoiceState,
} from "discord.js";
import path from "path";

import ms from "ms";

interface UserSound {
  user: string;
  sound: string;
}
interface PlaySoundPameters {
  guild: Guild;
  channel: Channel;
  sound: string;
}

export class BotClass {
  isPlaying = false;
  client: Client;

  userSounds: UserSound[] = [
    { user: "drobbe.", sound: "jesus" },
    { user: "hunterobot", sound: "venao" },
    { user: "nova_kratek", sound: "kratek" },
    { user: "gastaclaus", sound: "mariangela" },
    { user: "sazecj", sound: "bruja" },
    { user: "ceradrix", sound: "tutienes" },
    { user: "alexkiller5115", sound: "mate" },
    { user: "werefol.", sound: "jalabola" },
    { user: "blokkci", sound: "nacho" },
  ];

  constructor() {
    this.isPlaying = false;
    this.client = new Client({
      intents: 53608447,
    });
  }

  start() {
    this.client.login(process.env.TOKEN_GG);
    this.listenEvents();
  }

  listenEvents() {
    this.client.once("ready", () => {
      console.log(`Bot conectado como ${this.client.user?.tag}`);
      // this.nextRandomSound();
    });

    this.client.on("ready", async () => {
      console.log(`Encendido como ${this.client.user?.username}`);
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

    this.client.on(
      "voiceStateUpdate",
      (oldState: VoiceState, newState: VoiceState) => {
        if (!oldState.channel && newState.channel) {
          const userTag = newState.member?.user.tag;
          if (userTag === undefined) return;

          console.log(`${userTag} joined a voice channel.`);

          const userSound = this.userSounds.find(
            (userSound) => userSound.user === userTag
          );

          if (!userSound) return;
          try {
            this.playSound({
              channel: newState.channel,
              guild: newState.guild,
              sound: userSound.sound,
            });
          } catch (err) {
            console.error("Error connecting to the voice channel:", err);
          }
        }
      }
    );
  }

  nextRandomSound() {
    // Obtener el servidor (guild) donde deseas que funcione

    const minMs = 1 * 60 * 60 * 1000 * 3;
    const maxMs = 1 * 60 * 60 * 1000 * 12;
    const interval = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    console.log(`El proximo sonido sera en ${ms(interval)}`);

    setTimeout(() => {
      this.playRandomSoundInRandomChannel();
      this.nextRandomSound();
    }, interval);
  }

  async playRandomSoundInRandomChannel() {
    try {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        console.log("El bot no está en ningún servidor.");
        return;
      }

      const voiceChannels = guild.channels.cache.filter((channel) => {
        return (
          channel.type === ChannelType.GuildVoice &&
          channel.members.size > 0 &&
          channel.name !== "AFK"
        );
      });

      if (voiceChannels.size === 0) {
        console.log("No hay canales de voz en este servidor.");
        return;
      }

      const randomChannel = voiceChannels.random();

      if (randomChannel === undefined)
        return console.log("No hay canales de voz en este servidor.");

      this.playSound({ channel: randomChannel, guild: guild, sound: "grito" });
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
    // Obtener todos los canales de voz en el servidor
  }

  public async getGuildVoiceChanel() {
    const guild = this.client.guilds.cache.first();
    if (!guild) {
      throw new Error("El bot no está en ningún servidor.");
    }

    const voiceChannels = guild.channels.cache.filter((channel) => {
      return (
        channel.type === ChannelType.GuildVoice &&
        channel.members.size > 0 &&
        channel.name !== "AFK"
      );
    });

    if (voiceChannels.size === 0) {
      throw new Error("No hay canales de voz en este servidor.");
    }

    const randomChannel = voiceChannels.random() as Channel;

    return { guild: guild, channel: randomChannel };
  }

  public playSound(data: PlaySoundPameters) {
    try {
      const { channel, guild, sound } = data;
      if (this.isPlaying) return;

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });
      connection.once(VoiceConnectionStatus.Ready, () => {
        console.log("Connected to the voice channel!");
        const player = createAudioPlayer();
        const SOUND_PATH = path.join(__dirname, `../sounds/${sound}.mp3`);

        const resource = createAudioResource(SOUND_PATH);

        this.isPlaying = true;
        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
          this.isPlaying = false;
          console.log(
            "Reproducción finalizada y desconectado del canal de voz."
          );
        });
      });
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
  }
}
