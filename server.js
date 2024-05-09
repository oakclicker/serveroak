const https = require('https');
const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username10',
  host: '92.118.170.201',
  database: 'username10_db',
  password: 'Gb9QTN6Z',
  port: 5432,
});

const app = express();

// Middleware для обработки CORS запросов
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://oakgamebase.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Отправить успешный ответ на предварительный запрос
  } else {
    next(); // Продолжить обработку основного запроса
  }
});

app.post('/test', (req, res) => {
  res.status(200).send('Server has been successfully started!\n');
});

app.post('/adduser', async (req, res) => {
  try {
    const { name, username, user_id, photo_url } = req.body;
    const client = await pool.connect();
    
    // Проверяем, существует ли пользователь с данным user_id
    const checkUserQuery = 'SELECT * FROM users WHERE user_id = $1';
    const checkUserResult = await client.query(checkUserQuery, [user_id]);

    if (checkUserResult.rows.length > 0) {
      // Если пользователь существует, обновляем его данные
      const updateUserQuery = 'UPDATE users SET fullname = $1, username = $2, photo_url = $3 WHERE user_id = $4';
      await client.query(updateUserQuery, [name, username, photo_url, user_id]);
      console.log('User updated successfully:', req.body);
      res.status(200).send('User updated successfully!\n');
    } else {
      // Если пользователь не существует, добавляем новую запись
      const insertUserQuery = 'INSERT INTO users (fullname, username, user_id, photo_url) VALUES ($1, $2, $3, $4)';
      await client.query(insertUserQuery, [name, username, user_id, photo_url]);
      console.log('User added successfully:', req.body);
      res.status(200).send('User added successfully!\n');
    }

    client.release();
  } catch (error) {
    console.error('Error adding/updating user:', error);
    res.status(500).send('Error adding/updating user!\n');
  }
});

app.get('/loadUser', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    res.status(400).send('Missing user_id parameter!\n');
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
      res.status(200).json(userData);
    } else {
      res.status(404).send('User not found!\n');
    }
  } catch (error) {
    console.error('Error loading user:', error);
    res.status(500).send('Error loading user!\n');
  }
});

const port = 443;

https.createServer(options, app).listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
