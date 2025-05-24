import { useState } from 'react';
import API from '../services/api';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    onLogin(res.data.user);
  };

  return (
    <form onSubmit={login}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
