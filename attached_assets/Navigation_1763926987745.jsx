import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">Learning Platform</Link>
      </div>
      
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname.startsWith('/courses') ? 'active' : ''}>
          <Link to="/courses">My Courses</Link>
        </li>
        <li className={location.pathname.startsWith('/forum') ? 'active' : ''}>
          <Link to="/forum">
            Forum
            <span className="notification-badge">3</span>
          </Link>
        </li>
        <li className={location.pathname.startsWith('/certificates') ? 'active' : ''}>
          <Link to="/certificates">Certificates</Link>
        </li>
      </ul>

      <div className="nav-user">
        {/* User profile dropdown */}
      </div>
    </nav>
  );
};

export default Navigation;