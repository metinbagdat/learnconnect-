// components/Dashboard/TYTAYTDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocs 
} from 'firebase/firestore';
import { db } from '../../firebase';
import TYTDashboard from './TYTDashboard';
import AYTDashboard from './AYTDashboard';
import StudyAnalytics from './StudyAnalytics';
import WeakTopicAnalysis from './WeakTopicAnalysis';

const TYTAYTDashboard = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('tyt');
  const [studentData, setStudentData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);
  const [quickStats, setQuickStats] = useState({});

  useEffect(() => {
    // Listen to student data
    const unsubscribeStudent = onSnapshot(
      doc(db, 'students', studentId),
      (doc) => setStudentData(doc.data())
    );

    // Listen to progress data
    const unsubscribeProgress = onSnapshot(
      doc(db, 'student_progress', studentId),
      (doc) => {
        const data = doc.data();
        setProgressData(data);
        calculateQuickStats(data);
      }
    );

    // Get today's plan
    const today = new Date().toISOString().split('T')[0];
    const unsubscribePlan = onSnapshot(
      doc(db, 'daily_plans', studentId, 'plans', today),
      (doc) => setTodayPlan(doc.data())
    );

    return () => {
      unsubscribeStudent();
      unsubscribeProgress();
      unsubscribePlan();
    };
  }, [studentId]);

  const calculateQuickStats = (progress) => {
    if (!progress) return;

    const stats = {
      totalStudyHours: progress.totalStudyTime ? Math.round(progress.totalStudyTime / 60) : 0,
      completedTopics: progress.completedTopics || 0,
      averageTestScore: progress.averageScore || 0,
      weakTopicsCount: progress.analytics?.weakTopics?.length || 0,
      consistency: calculateStudyConsistency(progress)
    };

    setQuickStats(stats);
  };

  const calculateStudyConsistency = (progress) => {
    // Calculate study consistency based on recent activity
    return 85; // Placeholder
  };

  return (
    <div className="tyt-ayt-dashboard">
      {/* Header with Quick Stats */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>
            Hoş Geldin, {studentData?.personalInfo?.name}!
          </h1>
          <p className="subtitle">
            {studentData?.examPreferences?.targetPrograms?.[0] || 'Hedef Program'} için çalışma performansın
          </p>
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-value">{quickStats.totalStudyHours}h</div>
            <div className="stat-label">Toplam Çalışma</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quickStats.completedTopics}</div>
            <div className="stat-label">Tamamlanan Konu</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quickStats.averageTestScore}</div>
            <div className="stat-label">Ortalama Net</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quickStats.consistency}%</div>
            <div className="stat-label">Tutarlılık</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'tyt' ? 'active' : ''}`}
          onClick={() => setActiveTab('tyt')}
        >
          📊 TYT İlerleme
        </button>
        <button 
          className={`tab-button ${activeTab === 'ayt' ? 'active' : ''}`}
          onClick={() => setActiveTab('ayt')}
        >
          📚 AYT İlerleme
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Detaylı Analiz
        </button>
        <button 
          className={`tab-button ${activeTab === 'weak' ? 'active' : ''}`}
          onClick={() => setActiveTab('weak')}
        >
          🎯 Zayıf Konular
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'tyt' && (
          <TYTDashboard 
            studentId={studentId}
            progressData={progressData?.tyt_progress}
            todayPlan={todayPlan}
          />
        )}
        
        {activeTab === 'ayt' && (
          <AYTDashboard 
            studentId={studentId}
            progressData={progressData?.ayt_progress}
            todayPlan={todayPlan}
          />
        )}
        
        {activeTab === 'analytics' && (
          <StudyAnalytics 
            studentId={studentId}
            studentData={studentData}
          />
        )}
        
        {activeTab === 'weak' && (
          <WeakTopicAnalysis 
            studentId={studentId}
            weakTopics={progressData?.analytics?.weakTopics || []}
          />
        )}
      </div>
    </div>
  );
};

export default TYTAYTDashboard;