import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await api.login({ email, password });
      api.saveUser(userData);
      onLoginSuccess(userData);
      navigate(userData.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Log in to the portal</h2>
        <p style={{ color: 'var(--text-sub)' }}>Enter your email and password to continue.</p>

        {error && <div className="notice">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Log in
          </button>
        </form>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline-blue btn-small"
            onClick={() => {
              setEmail('admin@university.edu');
              setPassword('password123');
            }}
          >
            Fill admin demo
          </button>
          <button
            type="button"
            className="btn btn-outline-green btn-small"
            onClick={() => {
              setEmail('student@university.edu');
              setPassword('password123');
            }}
          >
            Fill student demo
          </button>
        </div>

        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          New student? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
