const https = require('https');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const hostname = 'oakgame.tech';
const token = '6708244878:AAF9sm6Io9B4dlGtVVv64KxtnLZKcXQ0g8Y';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/fullchain.pem')
};

const port = 443;

const server = https.createServer(options, (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('Server has been successfully started!\n');
  } else {
    res.writeHead(404);
    res.end('The page was not found!\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на https://${hostname}:${port}`);
  
  // Запускаем Telegram бот
  const bot = new TelegramBot(token, { polling: false });
  
  // Обработчик команды /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const fullname = msg.from.first_name + ' ' + msg.from.last_name;
    
    // Отправляем приветственное сообщение с кнопкой
    bot.sendMessage(chatId, `Приветствую, ${fullname}! Это тестовое приложение игру OAK Clicker! Чтобы запустить игру нажми на кнопку ниже.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
        ]
      }
    });
  });
});

server.on('error', (error) => {
  console.error(`Ошибка запуска сервера: ${error}`);
});
