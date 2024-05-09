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
  res.setHeader('Access-Control-Allow-Origin', 'https://oakgamebase.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

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
        
        const checkUserQuery = 'SELECT * FROM users WHERE user_id = $1';
        const checkUserResult = await client.query(checkUserQuery, [user_id]);

        if (checkUserResult.rows.length > 0) {
          const updateUserQuery = 'UPDATE users SET fullname = $1, username = $2, photo_url = $3 WHERE user_id = $4';
          await client.query(updateUserQuery, [name, username, photo_url, user_id]);
          console.log('User updated successfully:', data);
          res.writeHead(200);
          res.end('User updated successfully!\n');
        } else {
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
  } else if (req.url.startsWith('/loadUser') && req.method === 'GET') {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('user_id');
    if (!userId) {
      res.writeHead(400);
      res.end('Missing user_id parameter!\n');
      return;
    }

    try {
      const client = await pool.connect();
      const checkUserQuery = 'SELECT * FROM users WHERE user_id = $1';
      const checkUserResult = await client.query(checkUserQuery, [userId]);
      client.release();

      if (checkUserResult.rows.length > 0) {
        const userData = checkUserResult.rows[0];
        console.log('User data:', userData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userData));
      } else {
        res.writeHead(404);
        res.end('User not found!\n');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      res.writeHead(500);
      res.end('Error loading user!\n');
    }
  } else if (req.url === '/updateBalance' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { user_id, balance } = data;
        const client = await pool.connect();
  
        const checkUserQuery = 'SELECT * FROM users WHERE user_id = $1';
        const checkUserResult = await client.query(checkUserQuery, [user_id]);
  
        if (checkUserResult.rows.length > 0) {
          const updateUserBalanceQuery = 'UPDATE users SET balance = $1 WHERE user_id = $2';
          await client.query(updateUserBalanceQuery, [balance, user_id]);
          console.log('User balance updated successfully:', data);
          res.writeHead(200);
          res.end('User balance updated successfully!\n');
        } else {
          console.log('User not found while updating balance:', user_id);
          res.writeHead(404);
          res.end('User not found!\n');
        }
  
        client.release();
      } catch (error) {
        console.error('Error updating user balance:', error);
        res.writeHead(500);
        res.end('Error updating user balance!\n');
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
