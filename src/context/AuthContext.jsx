import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');

  // Guardamos el string crudo para el usuario
  const storedUserString = localStorage.getItem('user');

  // Intentamos parsear el usuario, pero protegemos el error
  let storedUser = null;
  try {
    storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  } catch (e) {
    console.warn('Error parsing user from localStorage:', e);
    storedUser = null;
  }

  const [token, setToken] = useState(storedToken || null);
  const [user, setUser] = useState(storedUser);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
