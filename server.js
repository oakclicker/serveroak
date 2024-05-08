const https = require('https');
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username10',
  host: '92.118.170.201',
  database: 'username10_db',
  password: 'Gb9QTN6Z',
  port: 5432,
});

const hostname = 'oakgame.tech';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/oakgame.tech/fullchain.pem')
};

const port = 443;

const server = https.createServer(options, async (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('Server has been successfully started!\n');
  } else if (req.url === '/adduser' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { name, username, user_id } = data;
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users (fullname, username, user_id) VALUES ($1, $2, $3)', [name, username, user_id]);
        client.release();
        console.log('User added successfully:', result.rows[0]);
        res.writeHead(200);
        res.end('User added successfully!\n');
      } catch (error) {
        console.error('Error adding user:', error);
        res.writeHead(500);
        res.end('Error adding user!\n');
      }
    });
  } else {
    res.writeHead(404);
    res.end('The page was not found!\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на https://${hostname}:${port}`);
});

server.on('error', (error) => {
  console.error(`Ошибка запуска сервера: ${error}`);
});
