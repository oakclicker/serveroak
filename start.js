const { spawn } = require('child_process');

// Запускаем server.js
const serverProcess = spawn('node', ['server.js']);

// Выводим логи процесса сервера
serverProcess.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

// Запускаем bot.js
const botProcess = spawn('node', ['bot.js']);

// Выводим логи процесса бота
botProcess.stdout.on('data', (data) => {
  console.log(`Bot stdout: ${data}`);
});

botProcess.stderr.on('data', (data) => {
  console.error(`Bot stderr: ${data}`);
});
