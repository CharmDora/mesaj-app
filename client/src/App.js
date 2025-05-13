import React, { useState, useEffect } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Mesajlar alınırken hata oluştu:', err));
  }, []);

  const sendMessage = () => {
    fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, message: newMessage }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewMessage('');
        return fetch('http://localhost:5000/messages');
      })
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  return (
    <div>
      {!username ? (
        <div>
          <input
            type="text"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setUsername(username)}>Giriş Yap</button>
        </div>
      ) : (
        <div>
          <h1>Merhaba, {username}!</h1>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Mesajınızı yazın"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Gönder</button>
        </div>
      )}
    </div>
  );
};

export default App;
