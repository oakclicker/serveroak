const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6708244878:AAFUWOnajy-rdiDB2Ti7xUIyG2NlR3gYf38';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const fullname = msg.from.first_name + ' ' + msg.from.last_name;
  const username = msg.from.username;
  const user_id = msg.from.id;

  // Отправляем приветственное сообщение с кнопкой
  bot.sendMessage(chatId, `Приветствую, ${fullname}! Это тестовое приложение игру OAK Clicker! Чтобы запустить игру нажми на кнопку ниже.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
      ]
    }
  });

  // Отправляем данные на сервер
  try {
    await axios.post('https://oakgame.tech/adduser', {
      name: fullname,
      username: username,
      user_id: user_id
    });
    console.log('Данные успешно отправлены на сервер.');
  } catch (error) {
    console.error('Ошибка отправки данных на сервер:', error);
  }
});

bot.on('error', (error) => {
  console.error(`Ошибка работы с ботом: ${error}`);
});
