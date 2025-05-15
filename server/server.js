const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const port = process.env.PORT || 5000;

// Frontend URL'sini belirlemek için ortam değişkeni kullanılır, yoksa localhost varsayılır
const frontendURL = process.env.FRONTEND_URL || '/'; // Aynı domainde çalıştığımız için '/' kullandık

app.use(cors({
  origin: frontendURL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Veritabanı dosyasının yolu (server.js dosyasına göre bir üst dizinde users.db)
const dbPath = path.resolve(__dirname, '../users.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı bağlantısı hatası:', err.message);
  } else {
    console.log('Veritabanı bağlantısı başarılı:', dbPath);
  }
});

// users tablosu yoksa oluştur
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
});

// Kayıt API'si
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

// Giriş API'si
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası.' });

    if (!row) return res.status(400).json({ message: 'Hesap bulunamadı.' });

    res.json({ message: 'Giriş başarılı!', username: row.username });
  });
});

// Kullanıcı kontrol API'si
app.post('/checkUser', (req, res) => {
  const { username } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ message: 'Veritabanı hatası.' });

    res.json({ exists: !!row });
  });
});

// Statik dosyaları sunmak için client klasörünü kullan
app.use(express.static(path.resolve(__dirname, '../client/build')));

// React uygulamasındaki diğer yolları desteklemek için
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});
