import React from 'react';

const Navbar = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('')
    : 'AK';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">C</div>
        <div>
          <h2>CollabBoard</h2>
          <p>Plan, track, and ship faster</p>
        </div>
      </div>
      <div className="navbar-user">
        <span className="status-pill">● Online</span>
        <div className="user-chip">{initials}</div>
      </div>
    </nav>
  );
};

export default Navbar;