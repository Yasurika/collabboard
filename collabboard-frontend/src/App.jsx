import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskBoard from './components/TaskBoard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (savedUser && savedUser !== 'undefined' && token) {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && parsedUser._id && parsedUser.email) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      console.error('Invalid stored user JSON:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsAuthChecked(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className="app-shell">
      {user ? (
        <>
          <Navbar user={user} />
          <main className="app-main">
            <TaskBoard user={user} onLogout={handleLogout} />
          </main>
        </>
      ) : (
        <main className="app-main">
          <Login onLoginSuccess={handleLoginSuccess} />
        </main>
      )}
    </div>
  );
}

export default App;