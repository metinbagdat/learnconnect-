// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import DecisionRulesEditor from './DecisionRulesEditor';
import AnalyticsDashboard from './AnalyticsDashboard';
import StudentTable from './StudentTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    checkAdminStatus();
    loadAdminStats();
  }, [user]);

  const checkAdminStatus = async () => {
    // In a real app, you'd check Firebase custom claims
    const adminUsers = ['admin@tytplanner.com']; // Mock admin list
    setIsAdmin(adminUsers.includes(user?.email));
  };

  const loadAdminStats = () => {
    const unsubscribe = onSnapshot(collection(db, 'Analytics'), (snapshot) => {
      const analyticsData = snapshot.docs.map(doc => doc.data());
      const latestReport = analyticsData[analyticsData.length - 1];
      
      if (latestReport) {
        setStats(latestReport.data);
      }
    });

    return unsubscribe;
  };

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Erişim Engellendi</h2>
        <p>Bu sayfayı görüntülemek için yönetici izinlerine ihtiyacınız var.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>TYT Planner Yönetim Paneli</h1>
        <div className="admin-stats">
          <div className="stat">
            <span className="value">{stats.totalStudents || 0}</span>
            <span className="label">Toplam Öğrenci</span>
          </div>
          <div className="stat">
            <span className="value">{stats.activeThisWeek || 0}</span>
            <span className="label">Aktif Bu Hafta</span>
          </div>
          <div className="stat">
            <span className="value">{stats.averageStudyTime || 0}h</span>
            <span className="label">Ort. Çalışma Süresi</span>
          </div>
        </div>
      </header>

      <nav className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analitik
        </button>
        <button 
          className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          ⚙️ AI Kuralları
        </button>
        <button 
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Öğrenciler
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'rules' && <DecisionRulesEditor />}
        {activeTab === 'students' && <StudentTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;