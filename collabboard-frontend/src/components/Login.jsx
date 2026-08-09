import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/apiServices';

const Auth = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        };

        await registerUser(payload);
        alert('Registered successfully! Please login.');
        setIsRegister(false);
        setFormData({ name: '', email: '', password: '' });
      } else {
        const res = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">C</div>
          <div>
            <span className="auth-brand-name">CollabBoard</span>
            <small>Team workspace</small>
          </div>
        </div>

        <div className="auth-header">
          <span className="auth-eyebrow">{isRegister ? 'Create account' : 'Welcome back'}</span>
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <p>
            {isRegister
              ? 'Build your team space and manage work together.'
              : 'Sign in to continue managing your board.'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-submit">
            {isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <button type="button" className="auth-toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Auth;