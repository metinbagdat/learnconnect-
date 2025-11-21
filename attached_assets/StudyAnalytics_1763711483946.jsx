// components/Analytics/StudyAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const StudyAnalytics = ({ studentId, studentData }) => {
  const [studySessions, setStudySessions] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [subjectDistribution, setSubjectDistribution] = useState([]);
  const [productivityData, setProductivityData] = useState([]);

  useEffect(() => {
    // Get study sessions from last 30 days
    const sessionsQuery = query(
      collection(db, 'study_sessions', studentId, 'sessions'),
      where('startTime', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      orderBy('startTime', 'asc')
    );

    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().startTime?.toDate().toISOString().split('T')[0]
      }));
      
      setStudySessions(sessions);
      analyzeStudyData(sessions);
    });

    return unsubscribe;
  }, [studentId]);

  const analyzeStudyData = (sessions) => {
    // Calculate weekly statistics
    const weeklyData = calculateWeeklyStats(sessions);
    setWeeklyStats(weeklyData);

    // Calculate subject distribution
    const subjectData = calculateSubjectDistribution(sessions);
    setSubjectDistribution(subjectData);

    // Calculate productivity trends
    const productivity = calculateProductivity(sessions);
    setProductivityData(productivity);
  };

  const calculateWeeklyStats = (sessions) => {
    const weeklyHours = {};
    const weeklyGoals = studentData?.performanceGoals?.weeklyStudyHours || 20;
    
    sessions.forEach(session => {
      const week = getWeekNumber(new Date(session.date));
      if (!weeklyHours[week]) {
        weeklyHours[week] = 0;
      }
      weeklyHours[week] += (session.duration || 0) / 60; // Convert to hours
    });

    return {
      currentWeek: Object.values(weeklyHours).slice(-1)[0] || 0,
      weeklyGoal: weeklyGoals,
      averageWeekly: Object.values(weeklyHours).reduce((a, b) => a + b, 0) / Object.keys(weeklyHours).length || 0,
      trend: calculateWeeklyTrend(weeklyHours)
    };
  };

  const calculateSubjectDistribution = (sessions) => {
    const distribution = {};
    
    sessions.forEach(session => {
      if (!distribution[session.subject]) {
        distribution[session.subject] = 0;
      }
      distribution[session.subject] += session.duration || 0;
    });

    return Object.entries(distribution).map(([subject, duration]) => ({
      subject: translateSubject(subject),
      duration: Math.round(duration / 60), // Convert to hours
      color: getSubjectColor(subject)
    }));
  };

  const calculateProductivity = (sessions) => {
    const dailyProductivity = {};
    
    sessions.forEach(session => {
      if (!dailyProductivity[session.date]) {
        dailyProductivity[session.date] = { totalDuration: 0, sessionCount: 0 };
      }
      dailyProductivity[session.date].totalDuration += session.duration || 0;
      dailyProductivity[session.date].sessionCount += 1;
    });

    return Object.entries(dailyProductivity).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      duration: Math.round(data.totalDuration / 60),
      efficiency: calculateDailyEfficiency(data),
      sessions: data.sessionCount
    }));
  };

  return (
    <div className="study-analytics">
      <h3>Detaylı Çalışma Analizleri</h3>
      
      {/* Weekly Overview */}
      <div className="analytics-section">
        <h4>Haftalık Çalışma Performansı</h4>
        <div className="weekly-stats">
          <div className="stat-item">
            <div className="stat-value">{weeklyStats.currentWeek?.toFixed(1)}h</div>
            <div className="stat-label">Bu Hafta</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{weeklyStats.weeklyGoal}h</div>
            <div className="stat-label">Hedef</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{weeklyStats.averageWeekly?.toFixed(1)}h</div>
            <div className="stat-label">Ortalama</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {weeklyStats.trend > 0 ? '📈' : weeklyStats.trend < 0 ? '📉' : '➡️'}
              {Math.abs(weeklyStats.trend)}%
            </div>
            <div className="stat-label">Değişim</div>
          </div>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="analytics-section">
        <h4>Derslere Göre Çalışma Dağılımı</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, duration }) => `${subject}: ${duration}h`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="duration"
              >
                {subjectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productivity Trend */}
      <div className="analytics-section">
        <h4>Günlük Verimlilik Trendi</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="duration" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Çalışma Süresi (saat)"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#ff7300" 
                name="Verimlilik (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Study Patterns */}
      <div className="analytics-section">
        <h4>Çalışma Alışkanlıkları</h4>
        <div className="pattern-cards">
          <div className="pattern-card">
            <h5>En Verimli Gün</h5>
            <div className="pattern-value">Pazar</div>
            <div className="pattern-detail">5.2 saat ortalama</div>
          </div>
          <div className="pattern-card">
            <h5>En Çok Çalışılan Ders</h5>
            <div className="pattern-value">Matematik</div>
            <div className="pattern-detail">12.5 saat/hafta</div>
          </div>
          <div className="pattern-card">
            <h5>Ortalama Oturum Süresi</h5>
            <div className="pattern-value">45 dakika</div>
            <div className="pattern-detail">8 oturum/gün</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const calculateWeeklyTrend = (weeklyHours) => {
  const weeks = Object.keys(weeklyHours).sort();
  if (weeks.length < 2) return 0;
  
  const lastWeek = weeklyHours[weeks[weeks.length - 1]];
  const previousWeek = weeklyHours[weeks[weeks.length - 2]];
  
  return ((lastWeek - previousWeek) / previousWeek) * 100;
};

const calculateDailyEfficiency = (dailyData) => {
  // Calculate efficiency based on session count and total duration
  const idealSessionLength = 45; // minutes
  const maxEfficiency = dailyData.sessionCount * idealSessionLength;
  
  return Math.min(100, (dailyData.totalDuration / maxEfficiency) * 100);
};

const getSubjectColor = (subject) => {
  const colors = {
    'turkish': '#8884d8',
    'mathematics': '#82ca9d',
    'science': '#ffc658',
    'social_sciences': '#ff8042',
    'mathematics_2': '#0088fe',
    'turkish_literature': '#00c49f'
  };
  return colors[subject] || '#cccccc';
};

export default StudyAnalytics;