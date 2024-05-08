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
        const { name, username, user_id, photo_url } = data;
        const client = await pool.connect();
        
        // Проверяем, существует ли пользователь с данным user_id
        const checkUserQuery = 'SELECT * FROM users WHERE user_id = $1';
        const checkUserResult = await client.query(checkUserQuery, [user_id]);

        if (checkUserResult.rows.length > 0) {
          // Если пользователь существует, обновляем его данные
          const updateUserQuery = 'UPDATE users SET fullname = $1, username = $2, photo_url = $3 WHERE user_id = $4';
          await client.query(updateUserQuery, [name, username, photo_url, user_id]);
          console.log('User updated successfully:', data);
          res.writeHead(200);
          res.end('User updated successfully!\n');
        } else {
          // Если пользователь не существует, добавляем новую запись
          const insertUserQuery = 'INSERT INTO users (fullname, username, user_id, photo_url) VALUES ($1, $2, $3, $4)';
          await client.query(insertUserQuery, [name, username, user_id, photo_url]);
          console.log('User added successfully:', data);
          res.writeHead(200);
          res.end('User added successfully!\n');
        }

        client.release();
      } catch (error) {
        console.error('Error adding/updating user:', error);
        res.writeHead(500);
        res.end('Error adding/updating user!\n');
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
