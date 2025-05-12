const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let messages = []; // Geçici mesaj listesi

// Mesajları listeleme
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Yeni mesaj ekleme
app.post('/messages', (req, res) => {
  const { username, message } = req.body;
  messages.push({ username, message });
  res.status(201).send({ message: 'Mesaj eklendi!' });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
