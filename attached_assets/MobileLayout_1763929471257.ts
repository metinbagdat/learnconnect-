// src/components/Mobile/MobileLayout.tsx
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import OfflineSync from './OfflineSync';
import PWAInstaller from './PWAInstaller';
import './MobileLayout.css';

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-layout">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-indicator">
          ⚠️ Çevrimdışı Mod - Senkronizasyon bekliyor
        </div>
      )}

      {/* Main Content */}
      <main className="mobile-content">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Anasayfa</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">Kurslar</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`}
          onClick={() => setActiveTab('planner')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Planlayıcı</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">Sınavlar</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profil</span>
        </button>
      </nav>

      {/* PWA Install Prompt */}
      <PWAInstaller />
      
      {/* Offline Sync Manager */}
      <OfflineSync />
    </div>
  );
};

// Offline Sync Component
const OfflineSync: React.FC = () => {
  const [pendingSyncs, setPendingSyncs] = useState<SyncItem[]>([]);

  useEffect(() => {
    // Listen for online event to sync pending changes
    const handleOnline = async () => {
      await syncPendingChanges();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const syncPendingChanges = async () => {
    // Implement offline-first synchronization
    // Sync tasks, progress, exam answers, etc.
  };

  return (
    <div className="offline-sync">
      {pendingSyncs.length > 0 && (
        <div className="sync-indicator">
          {pendingSyncs.length} işlem senkronizasyon bekliyor
        </div>
      )}
    </div>
  );
};

export default MobileLayout;