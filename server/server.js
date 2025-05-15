const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const port = process.env.PORT || 5000;
const frontendURL = 'https://mesaj-app-frontend.onrender.com';

app.use(cors({
  origin: 'https://mesaj-app-frontend.onrender.com', // Ön uç URL
  methods: '*', // Tüm HTTP metodlarına izin ver
  allowedHeaders: '*', // Tüm başlıklara izin ver
}));

app.use(express.json());

const dbPath = path.resolve(process.cwd(), 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı bağlantısı hatası:', err.message);
  } else {
    console.log('Veritabanı bağlantısı başarılı:', dbPath);
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası.' });
    if (row) return res.status(400).json({ message: 'Bu kullanıcı adı zaten var.' });
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) return res.status(500).json({ message: 'Kullanıcı eklenemedi.' });
      res.status(201).json({ message: 'Kayıt başarılı!' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası.' });
    if (!row) return res.status(400).json({ message: 'Hesap bulunamadı.' });
    res.json({ message: 'Giriş başarılı!', username: row.username });
  });
});

app.post('/checkUser', (req, res) => {
  const { username } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası.' });
    res.json({ exists: !!row });
  });
});

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port} - Allowed frontend origin: ${frontendURL}`);
});
