// App.js

import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {currentUser ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;