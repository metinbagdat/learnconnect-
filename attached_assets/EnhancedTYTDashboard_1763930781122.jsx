// Updated: EnhancedTYTDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import EnhancedErrorBoundary from '../EnhancedErrorBoundary';

// Memoized chart components for better performance
const MemoizedBarChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="subject" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="net" name="Mevcut Net" fill="#8884d8" />
      <Bar dataKey="targetNet" name="Hedef Net" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
));

const EnhancedTYTDashboard = ({ studentId, progressData, todayPlan }) => {
  const [testHistory, setTestHistory] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TYT_SUBJECTS = {
    turkish: { name: 'Türkçe', color: '#8884d8', totalQuestions: 40 },
    mathematics: { name: 'Matematik', color: '#82ca9d', totalQuestions: 40 },
    science: { name: 'Fen Bilimleri', color: '#ffc658', totalQuestions: 20 },
    social_sciences: { name: 'Sosyal Bilimler', color: '#ff8042', totalQuestions: 20 }
  };

  // Memoized data processing
  const processSubjectProgress = useCallback((tests, progressData) => {
    if (!tests || tests.length === 0) return [];

    const latestTest = tests[0];
    return Object.keys(TYT_SUBJECTS).map(subjectKey => {
      const subject = TYT_SUBJECTS[subjectKey];
      const subjectData = latestTest.subjects?.[subjectKey] || {};
      const targetNet = progressData?.subject_scores?.[subjectKey]?.targetNet || 
                       Math.round(subject.totalQuestions * 0.7);
      
      return {
        subject: subject.name,
        net: subjectData.net || 0,
        targetNet: targetNet,
        correct: subjectData.correct || 0,
        wrong: subjectData.wrong || 0,
        empty: subjectData.empty || subject.totalQuestions,
        percentage: ((subjectData.net || 0) / subject.totalQuestions) * 100,
        color: subject.color,
        efficiency: calculateNetEfficiency(subjectData)
      };
    });
  }, [TYT_SUBJECTS]);

  // Enhanced data fetching with error handling
  useEffect(() => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      const testsQuery = query(
        collection(db, 'practice_tests', studentId, 'tests'),
        where('testType', '==', 'TYT'),
        where('testDate', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        orderBy('testDate', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(testsQuery, 
        (snapshot) => {
          try {
            const tests = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              testDate: doc.data().testDate?.toDate().toLocaleDateString('tr-TR')
            }));
            
            setTestHistory(tests);
            const processedProgress = processSubjectProgress(tests, progressData);
            setSubjectProgress(processedProgress);
            setLoading(false);
          } catch (processingError) {
            console.error('Error processing test data:', processingError);
            setError('Veri işleme hatası');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error fetching test history:', error);
          setError('Test geçmişi yüklenirken hata oluştu');
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (fetchError) {
      console.error('Error setting up test query:', fetchError);
      setError('Veri sorgusu kurulurken hata oluştu');
      setLoading(false);
    }
  }, [studentId, progressData, processSubjectProgress]);

  const calculateNetEfficiency = (subjectData) => {
    const totalAnswered = (subjectData.correct || 0) + (subjectData.wrong || 0);
    if (totalAnswered === 0) return 0;
    return ((subjectData.correct || 0) / totalAnswered) * 100;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>TYT verileri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Veri yüklenemedi</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <div className="enhanced-tyt-dashboard">
        {/* Performance optimized charts */}
        <div className="net-goals-section">
          <h3>TYT Net Hedef Takibi</h3>
          <MemoizedBarChart data={subjectProgress} />
        </div>

        {/* Virtualized subject cards for better performance with many subjects */}
        <SubjectPerformanceCards 
          subjects={subjectProgress} 
          TYT_SUBJECTS={TYT_SUBJECTS}
        />

        {/* Conditional rendering for test history */}
        {testHistory.length > 0 && (
          <TestTrendSection testHistory={testHistory} />
        )}

        {/* Today's focus with fallback */}
        <TodaysFocusSection todayPlan={todayPlan} />
      </div>
    </EnhancedErrorBoundary>
  );
};

// Extracted components for better maintainability
const SubjectPerformanceCards = React.memo(({ subjects, TYT_SUBJECTS }) => (
  <div className="subject-performance">
    <h4>Ders Bazlı Performans Analizi</h4>
    <div className="subject-cards">
      {subjects.map((subject, index) => (
        <SubjectCard 
          key={subject.subject} 
          subject={subject} 
          color={TYT_SUBJECTS[Object.keys(TYT_SUBJECTS)[index]]?.color}
        />
      ))}
    </div>
  </div>
));

const SubjectCard = React.memo(({ subject, color }) => (
  <div className="subject-card">
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
      <ProgressBar 
        label="Net Hedefi"
        current={subject.net}
        target={subject.targetNet}
        total={subject.targetNet * 1.2} // Scale for visualization
        color={color}
      />
      <ProgressBar 
        label="Doğru"
        current={subject.correct}
        target={subject.correct + subject.wrong + subject.empty}
        color="#4CAF50"
      />
      <ProgressBar 
        label="Yanlış"
        current={subject.wrong}
        target={subject.correct + subject.wrong + subject.empty}
        color="#f44336"
      />
    </div>
    
    <div className="efficiency">
      <small>Verimlilik: %{subject.efficiency.toFixed(1)}</small>
    </div>
  </div>
));

const ProgressBar = React.memo(({ label, current, target, color = '#8884d8' }) => (
  <div className="progress-item">
    <span>{label}: {current}</span>
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ 
          width: `${Math.min(100, (current / target) * 100)}%`,
          backgroundColor: color
        }}
      ></div>
    </div>
  </div>
));

const TestTrendSection = React.memo(({ testHistory }) => (
  <div className="test-trend">
    <h4>TYT Deneme Geçmişi</h4>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={[...testHistory].reverse()}>
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
));

const TodaysFocusSection = React.memo(({ todayPlan }) => {
  if (!todayPlan?.tasks || todayPlan.tasks.length === 0) {
    return (
      <div className="todays-focus">
        <h4>Bugünün Öncelikleri</h4>
        <div className="no-tasks-message">
          <p>Bugün için planlanmış görev bulunmuyor.</p>
          <small>Yarın için yeni bir plan oluşturulacak.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="todays-focus">
      <h4>Bugünün Öncelikleri</h4>
      <div className="focus-items">
        {todayPlan.tasks.slice(0, 3).map((task, index) => (
          <div key={index} className="focus-item">
            <span className={`priority-dot ${task.priority}`}></span>
            <span className="task-subject">{task.subject}</span>
            <span className="task-topic">{task.topic}</span>
            <span className="task-duration">{task.duration}dak</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default EnhancedTYTDashboard;