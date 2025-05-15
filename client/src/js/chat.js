import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'Me', text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleStartChat = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://mesaj-app.onrender.com/checkUser', { // Render URL'sini kullandık
        username: enteredUsername,
      });

      if (response.data.exists) {
        setChatUser(enteredUsername);
        setMessages([
          { sender: 'System', text: `${enteredUsername} ile sohbete başladınız.` },
        ]);
        setErrorMessage('');
      } else {
        setErrorMessage('Kullanıcı adı bulunamadı.');
      }
    } catch (error) {
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Ekranı</h2>

      <button className="logout-button" onClick={handleLogout}>
        Çıkış Yap
      </button>

      {!chatUser ? (
        <form onSubmit={handleStartChat} className="start-chat-form">
          <label>Kiminle konuşmak istiyorsunuz?</label>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={enteredUsername}
            onChange={(e) => setEnteredUsername(e.target.value)}
            required
          />
          <button type="submit">Sohbeti Başlat</button>
          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      ) : (
        <>
          <h3>Şu an {chatUser} ile konuşuyorsunuz</h3>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                className={`message ${
                  message.sender === 'Me' ? 'my-message' : 'other-message'
                }`}
                key={index}
              >
                <strong>{message.sender}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Mesaj yaz..."
              className="message-input"
              value={newMessage}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              required
            />
            <button className="send-button" onClick={handleSendMessage}>
              Gönder
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
