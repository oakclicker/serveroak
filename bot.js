const { Telegraf } = require('telegraf');
const https = require('https');
const fs = require('fs');

const hostname = 'oakgame.tech';
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/fullchain.pem')
};
const port = 443;

const bot = new Telegraf('6708244878:AAF9sm6Io9B4dlGtVVv64KxtnLZKcXQ0g8Y');

bot.start((ctx) => {
  const fullname = `${ctx.message.from.first_name} ${ctx.message.from.last_name}`;
  const welcomeMessage = `Приветствую, ${fullname}! Это тестовое приложение игру OAK Clicker! Чтобы запустить игру нажми на кнопку ниже.`;
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Запустить игру', url: 'http://yourgameurl.com' }
      ]
    ]
  };

  ctx.reply(welcomeMessage, { reply_markup: inlineKeyboard });
});

const server = https.createServer(options, bot.webhookCallback('/'));

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на https://${hostname}:${port}`);
});

server.on('error', (error) => {
  console.error(`Ошибка запуска сервера: ${error}`);
});
