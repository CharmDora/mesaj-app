import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './js/login.js';
import Register from './js/register.js';
import Chat from './js/chat.js';
import PrivateRoute from './js/PrivateRoute.js'; // PrivateRoute import ediyoruz

import './css/login.css';
import './css/register.css';
import './css/chat.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* PrivateRoute ile chat ekranını sarmalıyoruz */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        
        {/* Varsayılan yönlendirme, login ekranına */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
