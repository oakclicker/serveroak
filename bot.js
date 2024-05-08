const https = require('https');
const fs = require('fs');
const Telegraf = require('telegraf');
const token = '6708244878:AAF9sm6Io9B4dlGtVVv64KxtnLZKcXQ0g8Y';

const hostname = 'oakgame.tech';
const port = 443;

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/fullchain.pem')
};

const server = https.createServer(options, (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('Server has been successfully started!\n');
  } else {
    res.writeHead(404);
    res.end('The page was not found!\n');
  }
});

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const fullname = ctx.from.first_name + ' ' + ctx.from.last_name;
  await ctx.replyWithMarkdown(`Приветствую, ${fullname}! Это тестовое приложение игру OAK Clicker! Чтобы запустить игру нажми на кнопку ниже.`, {
    reply_markup: {
      inline_keyboard: [[{
        text: 'Запустить Игру',
        url: 'https://t.me/oakclickertest_bot/click'
      }]]
    }
  });
});

server.on('error', (error) => {
  console.error(`Ошибка запуска сервера: ${error}`);
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на https://${hostname}:${port}`);
  bot.launch();
});