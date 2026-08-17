import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/apiServices';
import '../styles/auth.css';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        };

        await registerUser(payload);
        setError('');
        alert('✅ Registered successfully! Please login now.');
        setIsRegister(false);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
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
      setError(err.response?.data?.message || '❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Section - Branding & Info */}
      <div className="auth-left">
        <div className="auth-content">
          <div className="auth-logo-section">
            <div className="auth-logo-circle">
              <span className="auth-logo-text">📋</span>
            </div>
            <h1 className="auth-brand-title">CollabBoard</h1>
            <p className="auth-brand-subtitle">Team Collaboration Made Simple</p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <div>
                <h3>Fast & Intuitive</h3>
                <p>Manage tasks with ease and speed</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <div>
                <h3>Team Collaboration</h3>
                <p>Work together seamlessly</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <h3>Beautiful Design</h3>
                <p>Modern and clean interface</p>
              </div>
            </div>
          </div>

          <div className="auth-footer">
            <p>Join thousands of teams already using CollabBoard</p>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-title">
              {isRegister ? '🎉 Create Account' : '👋 Welcome Back'}
            </h2>
            <p className="auth-description">
              {isRegister
                ? 'Join our community and start collaborating'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="name">Full Name</label>
                <div className="input-group">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-icon">🔐</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-group">
                  <span className="input-icon">✓</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isRegister ? '🎨 Create Account' : '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            className="auth-toggle"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }}
          >
            {isRegister ? '✨ Already have an account? Login' : '✨ Create New Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;