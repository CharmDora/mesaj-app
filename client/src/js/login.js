import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'https://mesaj-app-backend.onrender.com';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        username,
        password,
      });

      if (response.data.message === 'Giriş başarılı!') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/chat');
      } else {
        setError('Hesap bulunamadı');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>
        Hesabınız yok mu? <a href="/register">Kayıt Ol</a>
      </p>
    </div>
  );
}

export default Login;
