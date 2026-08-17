import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskBoard from './components/TaskBoard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // App eka load weddi localStorage eke User/Token thiyenawada balana eka
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
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

  return (
    <div className="app-shell">
      {/* User log wela innawanam Navbar eka saha TaskBoard view eka render wenawa */}
      {user ? (
        <>
          <Navbar user={user} />
          <main className="app-main">
            <TaskBoard onLogout={handleLogout} />
          </main>
        </>
      ) : (
        /* User log wela nathnam Login view eka render wenawa */
        <main className="app-main">
          <Login onLoginSuccess={handleLoginSuccess} />
        </main>
      )}
    </div>
  );
}

export default App;