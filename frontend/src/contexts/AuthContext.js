// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const getUserToken = () => {
    return localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, getUserToken}}>
      {children}
    </AuthContext.Provider>
  );
};