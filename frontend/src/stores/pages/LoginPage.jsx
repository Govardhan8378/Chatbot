import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = ({ users, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p onClick={() => navigate('/register')} className="link">Don't have an account? Register</p>
      </form>
    </div>
  );
};

export default LoginPage;
