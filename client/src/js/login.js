import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Axios ile POST isteği gönderiyoruz
      const response = await axios.post('/login', { // URL backend ile aynı domain'de çalışacak şekilde düzenlendi
        username,
        password,
      });

      if (response.data.message === 'Giriş başarılı!') {
        localStorage.setItem('isAuthenticated', 'true'); // Giriş başarılıysa kullanıcıyı authenticated olarak işaretliyoruz
        navigate('/chat'); // Chat ekranına yönlendiriyoruz
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
