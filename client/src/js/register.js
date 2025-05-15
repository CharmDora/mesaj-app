import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Render ortamında backend URL'sini dinamik olarak belirle
      const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
      });

      // Kayıt işlemi başarılı olduğunda
      setSuccessMessage(response.data.message);
      setUsername(''); // Formu temizle
      setPassword(''); // Formu temizle
      setErrorMessage(''); // Hata mesajını sıfırla
    } catch (error) {
      // Hata durumu
      setErrorMessage(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="register-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button type="submit">Kayıt Ol</button>
      </form>
      <p>
        Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
      </p>
    </div>
  );
};

export default Register;
