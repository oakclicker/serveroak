const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6708244878:AAFUWOnajy-rdiDB2Ti7xUIyG2NlR3gYf38';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.from.first_name;
  const lastname = msg.from.last_name || '';
  const fullname = firstname + (lastname ? ' ' + lastname : '');
  const username = msg.from.username;
  const user_id = msg.from.id;
  try {

    const userProfilePhotos = await bot.getUserProfilePhotos(user_id);

    if (userProfilePhotos.total_count > 0) {

      const photoInfo = userProfilePhotos.photos[0][0];

      const photoUrl = await bot.getFileLink(photoInfo.file_id);

      await axios.post('https://oakgame.tech/adduser', {
        name: fullname,
        username: username,
        user_id: user_id,
        photo_url: photoUrl
      });
      bot.sendMessage(chatId, `Приветствую, ${fullname}! Это тестовое приложение игры OAK Clicker! Чтобы запустить игру, нажми на кнопку ниже.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
          ]
        }
      });
    } else {
      bot.sendMessage(chatId, `Приветствую, ${fullname}!\nЭто тестовое приложение игры OAK Clicker! Чтобы запустить игру, нажмите на кнопку ниже.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
          ]
        }
      });
    }
    console.log('Данные успешно отправлены на сервер.');
  } catch (error) {
    console.error('Ошибка отправки данных на сервер:', error);
  }
});

bot.on('error', (error) => {
  console.error(`Ошибка работы с ботом: ${error}`);
});
