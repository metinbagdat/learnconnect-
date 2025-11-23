// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import StatCard from '../Common/StatCard';
import ChartCard from '../Common/ChartCard';
import TaskList from '../Tasks/TaskList';
import AIChatWidget from '../AI/AIChatWidget';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [dailyPlan, setDailyPlan] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const planId = `${user.uid}_${today}`;

    // Listen to today's plan
    const unsubscribePlan = onSnapshot(
      doc(db, 'AIEngine/DailyPlans', planId),
      (doc) => {
        if (doc.exists()) {
          setDailyPlan(doc.data());
        } else {
          // Plan doesn't exist, generate one
          generateNewPlan();
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching daily plan:', error);
        setLoading(false);
      }
    );

    // Listen to student stats
    const unsubscribeStudent = onSnapshot(
      doc(db, 'Students', user.uid),
      (doc) => {
        if (doc.exists()) {
          const studentData = doc.data();
          setStats(calculateStats(studentData));
        }
      }
    );

    return () => {
      unsubscribePlan();
      unsubscribeStudent();
    };
  }, [user]);

  const generateNewPlan = async () => {
    try {
      const generateDailyPlan = httpsCallable(functions, 'generateDailyPlan');
      await generateDailyPlan();
    } catch (error) {
      console.error('Error generating plan:', error);
    }
  };

  const calculateStats = (studentData) => {
    const progress = studentData.progress || {};
    const totalTasks = Object.values(progress).reduce((sum, subject) => 
      sum + (subject.totalTasksCompleted || 0), 0
    );

    return {
      totalStudyTime: Math.round((studentData.totalStudyTime || 0) / 60),
      tasksCompleted: totalTasks,
      averageScore: studentData.averageScore || 0,
      streakDays: studentData.streakDays || 0
    };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Günlük planınız hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TYT Çalışma Planlayıcı</h1>
          <div className="header-actions">
            <button 
              className="btn-primary"
              onClick={generateNewPlan}
            >
              Yeni Plan Oluştur
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-overview">
        <div className="stats-grid">
          <StatCard
            title="Toplam Çalışma"
            value={`${stats.totalStudyTime || 0}h`}
            icon="⏱️"
            trend="+2h"
          />
          <StatCard
            title="Tamamlanan Görevler"
            value={stats.tasksCompleted || 0}
            icon="✅"
            trend="+5"
          />
          <StatCard
            title="Ortalama Puan"
            value={`${stats.averageScore || 0}%`}
            icon="📊"
            trend="+3%"
          />
          <StatCard
            title="Günlük Seri"
            value={stats.streakDays || 0}
            icon="🔥"
            trend="+1"
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-left">
          {/* Daily Plan */}
          <section className="daily-plan-section">
            <h2>Bugünün Planı</h2>
            {dailyPlan ? (
              <div className="plan-container">
                <div className="plan-header">
                  <h3>{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                  <span className="completion-rate">
                    %{dailyPlan.completion?.completionRate || 0} Tamamlandı
                  </span>
                </div>
                
                <TaskList tasks={dailyPlan.plan?.tasks || []} />
                
                <div className="plan-motivation">
                  <p>{dailyPlan.plan?.motivationalMessage}</p>
                </div>
              </div>
            ) : (
              <div className="no-plan">
                <p>Henüz planınız bulunmuyor.</p>
                <button 
                  className="btn-primary"
                  onClick={generateNewPlan}
                >
                  Plan Oluştur
                </button>
              </div>
            )}
          </section>

          {/* Progress Charts */}
          <section className="progress-section">
            <h2>İlerleme Grafiği</h2>
            <ChartCard type="line" data={generateChartData()} />
          </section>
        </div>

        <div className="content-right">
          {/* Study Tips */}
          <section className="tips-section">
            <h2>Çalışma İpuçları</h2>
            <div className="tips-list">
              {(dailyPlan?.plan?.studyTips || []).map((tip, index) => (
                <div key={index} className="tip-card">
                  <span className="tip-number">{index + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Chat Widget */}
          <AIChatWidget />
        </div>
      </div>
    </div>
  );
};

const generateChartData = () => {
  // Mock data - would come from performance logs
  return {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        label: 'Günlük Net',
        data: [25, 28, 30, 32, 35, 33, 36],
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.1)',
      }
    ]
  };
};

export default Dashboard;