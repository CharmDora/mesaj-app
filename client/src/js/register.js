import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/register.css';

const BACKEND_URL = 'https://mesaj-app-backend.onrender.com';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        username,
        password,
      });

      setSuccessMessage(response.data.message);
      setUsername('');
      setPassword('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Bir hata oluştu.');
      setSuccessMessage('');
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
