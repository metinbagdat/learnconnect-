// src/components/Progress/EnhancedProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './EnhancedProgressDashboard.css';

const EnhancedProgressDashboard = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  useEffect(() => {
    if (!user) return;

    let dateFilter = new Date();
    switch (timeRange) {
      case 'week':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case 'all':
        dateFilter = new Date(0); // Beginning of time
        break;
    }

    const q = query(
      collection(db, 'AIEngine/PerformanceLogs'),
      where('student_id', '==', user.uid),
      where('timestamp', '>=', dateFilter),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate().toLocaleDateString('tr-TR')
      }));

      setPerformanceData(logs);
      calculateSubjectStats(logs);
    });

    return unsubscribe;
  }, [user, timeRange]);

  const calculateSubjectStats = (logs) => {
    const stats = {};
    
    logs.forEach(log => {
      const subject = log.subject;
      if (!stats[subject]) {
        stats[subject] = {
          totalScore: 0,
          count: 0,
          totalTime: 0,
          accuracy: 0,
          recentScores: []
        };
      }
      
      stats[subject].totalScore += log.performance.score;
      stats[subject].count += 1;
      stats[subject].totalTime += log.performance.time_spent;
      stats[subject].accuracy += log.performance.accuracy;
      stats[subject].recentScores.push({
        score: log.performance.score,
        date: log.date
      });
    });

    // Calculate averages
    Object.keys(stats).forEach(subject => {
      stats[subject].averageScore = Math.round(stats[subject].totalScore / stats[subject].count);
      stats[subject].averageAccuracy = Math.round(stats[subject].accuracy / stats[subject].count);
      stats[subject].averageTime = Math.round(stats[subject].totalTime / stats[subject].count);
    });

    setSubjectStats(stats);
  };

  const getProgressChartData = () => {
    const dailyData = {};
    
    performanceData.forEach(log => {
      if (!dailyData[log.date]) {
        dailyData[log.date] = {
          date: log.date,
          totalScore: 0,
          count: 0,
          subjects: new Set()
        };
      }
      dailyData[log.date].totalScore += log.performance.score;
      dailyData[log.date].count += 1;
      dailyData[log.date].subjects.add(log.subject);
    });

    return Object.values(dailyData).map(day => ({
      date: day.date.split('/').slice(0, 2).join('/'), // DD/MM format
      averageScore: Math.round(day.totalScore / day.count),
      subjectsCount: day.subjects.size
    }));
  };

  const getSubjectDistributionData = () => {
    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject: getSubjectLabel(subject),
      value: stats.count,
      averageScore: stats.averageScore
    }));
  };

  const getWeakAreas = () => {
    return Object.entries(subjectStats)
      .filter(([_, stats]) => stats.averageScore < 70)
      .map(([subject, stats]) => ({
        subject: getSubjectLabel(subject),
        score: stats.averageScore,
        trend: calculateTrend(stats.recentScores)
      }));
  };

  const calculateTrend = (scores) => {
    if (scores.length < 2) return 'stable';
    const recent = scores.slice(-3).reduce((a, b) => a + b.score, 0) / 3;
    const previous = scores.slice(-6, -3).reduce((a, b) => a + b.score, 0) / 3;
    return recent > previous ? 'improving' : recent < previous ? 'declining' : 'stable';
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      'Turkish': 'Türkçe',
      'Mathematics': 'Matematik',
      'Science': 'Fen Bilimleri',
      'SocialStudies': 'Sosyal Bilimler'
    };
    return labels[subject] || subject;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="enhanced-progress-dashboard">
      <div className="dashboard-header">
        <h2>İlerleme Takibi</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Son 1 Hafta
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Son 1 Ay
          </button>
          <button 
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => setTimeRange('all')}
          >
            Tüm Zamanlar
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">
            {performanceData.length}
          </div>
          <div className="stat-label">Tamamlanan Görev</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(performanceData.reduce((sum, log) => sum + log.performance.score, 0) / performanceData.length) || 0}%
          </div>
          <div className="stat-label">Ortalama Puan</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(performanceData.reduce((sum, log) => sum + log.performance.time_spent, 0) / 60)}s
          </div>
          <div className="stat-label">Toplam Çalışma</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Object.keys(subjectStats).length}
          </div>
          <div className="stat-label">Çalışılan Ders</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Score Trend Chart */}
        <div className="chart-container">
          <h3>Puan Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getProgressChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="averageScore" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Ortalama Puan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution */}
        <div className="chart-container">
          <h3>Ders Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getSubjectDistributionData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, value }) => `${subject}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getSubjectDistributionData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Performance */}
        <div className="chart-container">
          <h3>Ders Bazlı Performans</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSubjectDistributionData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#82ca9d" name="Ortalama Puan" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak Areas Analysis */}
      {getWeakAreas().length > 0 && (
        <div className="weak-areas-section">
          <h3>Geliştirilmesi Gereken Alanlar</h3>
          <div className="weak-areas-list">
            {getWeakAreas().map((area, index) => (
              <div key={index} className="weak-area-card">
                <div className="area-header">
                  <span className="subject-name">{area.subject}</span>
                  <span className={`score ${area.score < 50 ? 'low' : 'medium'}`}>
                    {area.score}%
                  </span>
                </div>
                <div className="area-trend">
                  <span className={`trend-indicator ${area.trend}`}>
                    {area.trend === 'improving' ? '📈' : 
                     area.trend === 'declining' ? '📉' : '➡️'}
                    {area.trend === 'improving' ? 'İyileşiyor' : 
                     area.trend === 'declining' ? 'Düşüş' : 'Sabit'}
                  </span>
                </div>
                <div className="improvement-tips">
                  {getImprovementTips(area.subject, area.score)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getImprovementTips = (subject, score) => {
  const tips = {
    'Türkçe': [
      'Paragraf sorularında hızını artır',
      'Dil bilgisi kurallarını tekrar et',
      'Sözcük dağarcığını geliştir'
    ],
    'Matematik': [
      'Temel kavramları pekiştir',
      'Problem çözme stratejileri geliştir',
      'Pratik yapmayı artır'
    ],
    'Fen Bilimleri': [
      'Formülleri düzenli tekrarla',
      'Deney sorularına odaklan',
      'Kavram haritaları oluştur'
    ],
    'Sosyal Bilimler': [
      'Kronolojik çalış',
      'Harita okuma becerilerini geliştir',
      'Önemli tarihleri not al'
    ]
  };

  return tips[subject]?.[0] || 'Düzenli tekrar ve pratik yap';
};

export default EnhancedProgressDashboard;