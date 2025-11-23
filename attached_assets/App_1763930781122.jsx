// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import Dashboard from './components/Dashboard/Dashboard';
import DailyPlan from './components/DailyPlan/DailyPlan';
import ProgressTracking from './components/Progress/ProgressTracking';
import AIChat from './components/AI/AIChat';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/plan" element={<DailyPlan />} />
                <Route path="/progress" element={<ProgressTracking />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;