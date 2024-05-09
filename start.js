const { spawn } = require('child_process');

const serverProcess = spawn('node', ['server.js']);

serverProcess.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

const botProcess = spawn('node', ['bot.js']);

botProcess.stdout.on('data', (data) => {
  console.log(`Bot stdout: ${data}`);
});

botProcess.stderr.on('data', (data) => {
  console.error(`Bot stderr: ${data}`);
});
