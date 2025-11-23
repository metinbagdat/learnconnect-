// src/components/Layout/ResponsiveLayout.jsx
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTheme } from '../../contexts/ThemeContext';
import './ResponsiveLayout.css';

const ResponsiveLayout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : 'light'} ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="mobile-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="app-title">TYT Planner</h1>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </header>
      )}

      {/* Sidebar for Desktop/Tablet */}
      {(isTablet || !isMobile) && (
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>TYT Planner</h2>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <NavItem icon="📊" label="Dashboard" active />
            <NavItem icon="📅" label="Günlük Plan" />
            <NavItem icon="📈" label="İlerleme" />
            <NavItem icon="💬" label="AI Asistan" />
            <NavItem icon="⚙️" label="Ayarlar" />
          </nav>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="mobile-sidebar" onClick={e => e.stopPropagation()}>
            <nav className="mobile-nav">
              <NavItem icon="📊" label="Dashboard" active />
              <NavItem icon="📅" label="Günlük Plan" />
              <NavItem icon="📈" label="İlerleme" />
              <NavItem icon="💬" label="AI Asistan" />
              <NavItem icon="⚙️" label="Ayarlar" />
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="bottom-nav">
          <BottomNavItem icon="📊" label="Anasayfa" />
          <BottomNavItem icon="📅" label="Plan" />
          <BottomNavItem icon="📈" label="İlerleme" />
          <BottomNavItem icon="💬" label="AI" />
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`nav-item ${active ? 'active' : ''}`}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </div>
);

const BottomNavItem = ({ icon, label }) => (
  <button className="bottom-nav-item">
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </button>
);

export default ResponsiveLayout;