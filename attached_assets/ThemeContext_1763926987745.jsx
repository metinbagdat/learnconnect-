// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#6366f1');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('tyt-planner-theme');
    const savedAccentColor = localStorage.getItem('tyt-planner-accent-color');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }

    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  useEffect(() => {
    // Update CSS variables when theme changes
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0a0a0');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#64748b');
    }

    root.style.setProperty('--accent-color', accentColor);
    
    // Save to localStorage
    localStorage.setItem('tyt-planner-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('tyt-planner-accent-color', accentColor);
  }, [isDarkMode, accentColor]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  const setCustomAccentColor = (color) => {
    setAccentColor(color);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    accentColor,
    setAccentColor: setCustomAccentColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};