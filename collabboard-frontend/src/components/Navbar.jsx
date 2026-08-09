import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">📌</div>
        <div>
          <h2>CollabBoard</h2>
          <p>Plan, track, and ship faster</p>
        </div>
      </div>
      <div className="navbar-user">
        <span className="status-pill">● Online</span>
        <div className="user-chip">AK</div>
      </div>
    </nav>
  );
};

export default Navbar;