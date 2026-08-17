import React from 'react';

const activeMembers = [
  { id: 'yk', name: 'Yasurika', initials: 'YK', color: '#667eea' },
  { id: 'sl', name: 'Sajini', initials: 'SL', color: '#f59e0b' },
  { id: 'tm', name: 'Tharindu', initials: 'TM', color: '#10b981' },
  { id: 'nd', name: 'Nadun', initials: 'ND', color: '#ef4444' },
];

const Navbar = ({ user }) => {
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
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
        <div className="team-presence-inline" aria-label="Active team members">
          {activeMembers.map((member) => (
            <div key={member.id} className="presence-item-inline" title={member.name}>
              <span className="presence-avatar" style={{ background: member.color }}>
                {member.initials}
              </span>
              <span className="presence-dot" />
            </div>
          ))}
        </div>

        <span className="status-pill">Online</span>
        <div className="user-chip">{initials}</div>
      </div>
    </nav>
  );
};

export default Navbar;