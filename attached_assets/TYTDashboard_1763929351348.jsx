// components/Dashboard/TYTDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const TYTDashboard = ({ studentId, progressData, todayPlan }) => {
  const [testHistory, setTestHistory] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);

  const TYT_SUBJECTS = {
    turkish: { name: 'Türkçe', color: '#8884d8', totalQuestions: 40 },
    mathematics: { name: 'Matematik', color: '#82ca9d', totalQuestions: 40 },
    science: { name: 'Fen Bilimleri', color: '#ffc658', totalQuestions: 20 },
    social_sciences: { name: 'Sosyal Bilimler', color: '#ff8042', totalQuestions: 20 }
  };

  useEffect(() => {
    // Fetch recent TYT tests
    const testsQuery = query(
      collection(db, 'practice_tests', studentId, 'tests'),
      where('testType', '==', 'TYT'),
      orderBy('testDate', 'desc'),
      where('testDate', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
    );

    const unsubscribe = onSnapshot(testsQuery, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        testDate: doc.data().testDate?.toDate().toLocaleDateString('tr-TR')
      }));
      setTestHistory(tests);
      updateSubjectProgress(tests);
    });

    return unsubscribe;
  }, [studentId]);

  const updateSubjectProgress = (tests) => {
    if (tests.length === 0) return;

    const latestTest = tests[0];
    const progress = Object.keys(TYT_SUBJECTS).map(subjectKey => {
      const subject = TYT_SUBJECTS[subjectKey];
      const subjectData = latestTest.subjects?.[subjectKey] || {};
      
      return {
        subject: subject.name,
        net: subjectData.net || 0,
        targetNet: progressData?.subject_scores?.[subjectKey]?.targetNet || subject.totalQuestions * 0.7,
        correct: subjectData.correct || 0,
        wrong: subjectData.wrong || 0,
        empty: subjectData.empty || subject.totalQuestions,
        percentage: ((subjectData.net || 0) / subject.totalQuestions) * 100,
        color: subject.color
      };
    });

    setSubjectProgress(progress);
  };

  const calculateNetEfficiency = (subject) => {
    const totalAnswered = subject.correct + subject.wrong;
    if (totalAnswered === 0) return 0;
    return (subject.correct / totalAnswered) * 100;
  };

  return (
    <div className="tyt-dashboard">
      {/* Net Goals Overview */}
      <div className="net-goals-section">
        <h3>TYT Net Hedef Takibi</h3>
        <div className="net-comparison-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'net' || name === 'targetNet') return [value, name === 'net' ? 'Mevcut Net' : 'Hedef Net'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="net" name="Mevcut Net" fill="#8884d8" />
              <Bar dataKey="targetNet" name="Hedef Net" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance Details */}
      <div className="subject-performance">
        <h4>Ders Bazlı Performans Analizi</h4>
        <div className="subject-cards">
          {subjectProgress.map((subject, index) => (
            <div key={subject.subject} className="subject-card">
              <div className="subject-header">
                <h5>{subject.subject}</h5>
                <span 
                  className="net-badge"
                  style={{ 
                    backgroundColor: subject.net >= subject.targetNet ? '#4CAF50' : '#f44336' 
                  }}
                >
                  {subject.net} Net
                </span>
              </div>
              
              <div className="progress-bars">
                <div className="progress-item">
                  <span>Net Hedefi: {subject.targetNet}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(100, (subject.net / subject.targetNet) * 100)}%`,
                        backgroundColor: subject.color
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <span>Doğru: {subject.correct}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill correct"
                      style={{ width: `${(subject.correct / subject.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <span>Yanlış: {subject.wrong}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill wrong"
                      style={{ width: `${(subject.wrong / subject.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="efficiency">
                <small>Verimlilik: %{calculateNetEfficiency(subject).toFixed(1)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test History Trend */}
      {testHistory.length > 0 && (
        <div className="test-trend">
          <h4>TYT Deneme Geçmişi</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={testHistory.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="testDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="calculatedScores.overall.overallScore" 
                stroke="#8884d8" 
                name="TYT Puanı"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="calculatedScores.overall.totalNet" 
                stroke="#82ca9d" 
                name="Toplam Net"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Today's Focus */}
      {todayPlan && (
        <div className="todays-focus">
          <h4>Bugünün Öncelikleri</h4>
          <div className="focus-items">
            {todayPlan.tasks?.slice(0, 3).map((task, index) => (
              <div key={index} className="focus-item">
                <span className={`priority-dot ${task.priority}`}></span>
                <span className="task-subject">{task.subject}</span>
                <span className="task-topic">{task.topic}</span>
                <span className="task-duration">{task.duration}dak</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TYTDashboard;