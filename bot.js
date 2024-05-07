const https = require('https');
const fs = require('fs');
const hostname = 'oakgame.tech';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/fullchain.pem')
};

const port = 443;

const server = https.createServer(options, (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('Сервер успешно работает\n');
  } else {
    res.writeHead(404);
    res.end('Страница не найдена\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на https://${hostname}:${port}`);
});

server.on('error', (error) => {
  console.error(`Ошибка запуска сервера: ${error}`);
});
