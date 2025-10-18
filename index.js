const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const https = require('https');

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

  // lệnh test để kiểm tra TTS
  else if (message.content === '!test') {
    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
      message.reply('🔊 Bot đã trong voice channel. Hãy thử gõ tin nhắn bất kỳ!');
      console.log('🧪 Test command: Bot in voice channel');
      console.log('🔍 Connection state:', connection.state.status);
    } else {
      message.reply('❌ Bot chưa join voice channel. Gõ !join trước!');
      console.log('🧪 Test command: Bot NOT in voice channel');
    }
  }

  // lệnh test audio trực tiếp
  else if (message.content === '!tts test') {
    const connection = getVoiceConnection(message.guild.id);
    if (connection && message.member?.voice?.channel) {
      try {
        console.log('🧪 Testing direct TTS...');
        const testText = 'Xin chào, đây là test audio';
        const url = googleTTS.getAudioUrl(testText, { lang: 'vi', slow: false });
        
        const player = createAudioPlayer();
        const resource = createAudioResource(url);
        
        player.play(resource);
        connection.subscribe(player);
        
        message.reply('🎵 Đang test audio...');
        console.log('🎵 Test audio sent');
      } catch (error) {
        console.error('❌ Test TTS error:', error);
        message.reply('❌ Lỗi test TTS: ' + error.message);
      }
    } else {
      message.reply('❌ Bot cần ở trong voice channel và bạn cũng vậy!');
    }
  }

  // chỉ đọc tin nhắn khi bot đã ở trong voice channel
  else {
    const connection = getVoiceConnection(message.guild.id);
    
    // chỉ nói khi bot đã join voice channel và user cũng ở trong voice channel
    if (connection && message.member?.voice?.channel) {
      try {
        console.log(`🗣️ Đang đọc tin nhắn: "${message.content}"`);
        
        if (!message.content || message.content.trim().length === 0) {
          console.log('❌ Tin nhắn trống, bỏ qua');
          return;
        }
        
        const url = googleTTS.getAudioUrl(message.content, { lang: 'vi', slow: false });
        console.log(`🔗 TTS URL: ${url}`);
        
        if (!url) {
          console.error('❌ Không thể tạo TTS URL');
          message.reply('❌ Không thể tạo audio từ tin nhắn này!');
          return;
        }
        
        const player = createAudioPlayer();
        
        // Tạo audio resource đơn giản
        const resource = createAudioResource(url);
        console.log('✅ Đã tạo audio resource');
        
        player.on('error', error => {
          console.error('❌ Player error details:', error);
          console.error('❌ Error stack:', error.stack);
          message.reply(`❌ Lỗi player: ${error.message}`);
        });
        
        resource.on('error', error => {
          console.error('❌ Resource error details:', error);
          console.error('❌ Resource error stack:', error.stack);
          message.reply(`❌ Lỗi resource: ${error.message}`);
        });
        
        player.on(AudioPlayerStatus.Playing, () => {
          console.log('▶️ Đang phát audio...');
        });
        
        player.on(AudioPlayerStatus.Idle, () => {
          console.log('⏹️ Đã phát xong audio');
        });
        
        const subscription = connection.subscribe(player);
        if (!subscription) {
          console.error('❌ Không thể subscribe player vào connection');
          message.reply('❌ Không thể kết nối audio!');
          return;
        }
        
        player.play(resource);
        console.log('🎵 Đã gửi lệnh phát audio');

        // Bot sẽ ở lại voice channel sau khi đọc xong
      } catch (error) {
        console.error('❌ TTS Error:', error);
        message.reply('❌ Có lỗi khi đọc tin nhắn!');
      }
    } else if (!connection) {
      console.log('❌ Bot chưa join voice channel');
    } else if (!message.member?.voice?.channel) {
      console.log('❌ User không ở trong voice channel');
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
