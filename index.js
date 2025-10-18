const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;

// Validate token
if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN không được tìm thấy trong environment variables!');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, // cần để bot vào kênh voice
  ]
});

client.once('ready', () => {
  console.log(`✅ Bot đã online với tên: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // nếu người dùng gõ !join -> bot vào voice channel
  if (message.content === '!join') {
    const channel = message.member?.voice?.channel;
    if (!channel) return message.reply('❌ Bạn phải vào kênh voice trước!');
    
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    message.reply('🔊 Bot đã vào voice channel!');
  }

  // nếu người dùng gõ !leave -> bot rời voice channel
  else if (message.content === '!leave') {
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      connection.destroy();
      message.reply('👋 Bot đã rời voice channel!');
    } else {
      message.reply('❌ Bot không ở trong voice channel nào!');
    }
  }

  // chỉ đọc tin nhắn khi bot đã ở trong voice channel
  else {
    const connection = getVoiceConnection(message.guild.id);
    
    // chỉ nói khi bot đã join voice channel và user cũng ở trong voice channel
    if (connection && message.member?.voice?.channel) {
      try {
        const url = googleTTS.getAudioUrl(message.content, { lang: 'vi', slow: false });
        
        const player = createAudioPlayer();
        const resource = createAudioResource(url);
        player.play(resource);
        connection.subscribe(player);

        // Bot sẽ ở lại voice channel sau khi đọc xong
      } catch (error) {
        console.error('TTS Error:', error);
        message.reply('❌ Có lỗi khi đọc tin nhắn!');
      }
    }
    // nếu bot chưa join hoặc user không ở voice channel thì không làm gì cả
  }
});

// Error handling
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

client.login(TOKEN).catch(error => {
  console.error('Failed to login:', error);
  process.exit(1);
});
