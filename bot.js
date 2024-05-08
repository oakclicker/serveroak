const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6708244878:AAFUWOnajy-rdiDB2Ti7xUIyG2NlR3gYf38';

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.from.first_name;
  const lastname = msg.from.last_name || '';
  const fullname = firstname + (lastname ? ' ' + lastname : '');
  const username = msg.from.username;
  const user_id = msg.from.id;

  try {
    // Получаем фотографии профиля пользователя
    const userProfilePhotos = await bot.getUserProfilePhotos(user_id);
    // Проверяем, есть ли фотографии профиля
    if (userProfilePhotos.total_count > 0) {
      // Получаем информацию о последней фотографии профиля
      const photoInfo = userProfilePhotos.photos[0][0];
      // Получаем ссылку на файл аватарки
      const fileLink = await bot.getFileLink(photoInfo.file_id);
      // Скачиваем аватарку
      const response = await axios({
        method: 'GET',
        url: fileLink,
        responseType: 'stream'
      });
      // Записываем аватарку в файл
      response.data.pipe(fs.createWriteStream(`users_ico/avatar_${user_id}.png`));
      // Отправляем фотографию вместе с приветственным сообщением
      bot.sendPhoto(chatId, photoInfo.file_id, {
        caption: `Приветствую, ${fullname}! Это тестовое приложение игры OAK Clicker! Чтобы запустить игру, нажмите на кнопку ниже.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
          ]
        }
      });
    } else {
      // Если у пользователя нет фотографий профиля, отправляем только приветственное сообщение
      bot.sendMessage(chatId, `Приветствую, ${fullname}! Это тестовое приложение игры OAK Clicker! Чтобы запустить игру, нажмите на кнопку ниже.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Запустить Игру', url: 'https://t.me/oakclickertest_bot/click' }]
          ]
        }
      });
    }

    // Отправляем данные на сервер
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
