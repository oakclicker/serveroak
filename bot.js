const TelegramBot = require('node-telegram-bot-api');

const token = '6708244878:AAFUWOnajy-rdiDB2Ti7xUIyG2NlR3gYf38';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

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

bot.on('error', (error) => {
  console.error(`Ошибка работы с ботом: ${error}`);
});
