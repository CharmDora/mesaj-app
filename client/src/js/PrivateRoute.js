import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // localStorage üzerinden kontrol ediyoruz.

  if (!isAuthenticated) {
    // Eğer kullanıcı giriş yapmadıysa login sayfasına yönlendiriyoruz
    return <Navigate to="/login" />;
  }

  return children; // Kullanıcı giriş yapmışsa, Chat ekranını render ediyoruz.
};

export default PrivateRoute;
