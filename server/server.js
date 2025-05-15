const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Path modülünü ekledik
const app = express();
const port = process.env.PORT || 5000; // Render için PORT ortam değişkeni

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Render frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// users.db'nin Render'da doğru çalışmasını sağlamak için
const dbPath = path.resolve(__dirname, '../users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı bağlantısı hatası: ', err.message);
  } else {
    console.log('Veritabanı bağlantısı başarılı.');
  }
});

// Kullanıcıları veritabanında tutacak tabloyu oluşturma
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
});

// API Endpoints

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Veritabanı hatası.' });
    }

    if (row) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten var.' });
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Kullanıcı eklenemedi.' });
      }
      res.status(201).json({ message: 'Kayıt başarılı!' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Veritabanı hatası.' });
    }

    if (!row) {
      return res.status(400).json({ message: 'Hesap bulunamadı.' });
    }

    res.json({ message: 'Giriş başarılı!', username: row.username });
  });
});

app.post('/checkUser', (req, res) => {
  const { username } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Veritabanı hatası.' });
    }

    res.json({ exists: !!row });
  });
});

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});
