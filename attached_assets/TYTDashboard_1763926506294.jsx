// components/TYTDashboard.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TYTDashboard = ({ studentProgress, practiceTests }) => {
  const [netGoals, setNetGoals] = useState({});
  const [subjectProgress, setSubjectProgress] = useState([]);

  useEffect(() => {
    if (studentProgress?.tyt_progress) {
      const progressData = Object.entries(studentProgress.tyt_progress.subject_scores).map(([subject, data]) => ({
        subject: translateSubject(subject),
        net: data.net,
        targetNet: data.targetNet,
        correct: data.correct,
        wrong: data.wrong,
        empty: data.empty
      }));
      setSubjectProgress(progressData);
    }
  }, [studentProgress]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const translateSubject = (subject) => {
    const translations = {
      'turkish': 'Türkçe',
      'mathematics': 'Matematik',
      'science': 'Fen Bilimleri',
      'social_sciences': 'Sosyal Bilimler'
    };
    return translations[subject] || subject;
  };

  return (
    <div className="tyt-dashboard">
      <h2>TYT Hazırlık Paneli</h2>
      
      <div className="score-overview">
        <div className="overall-score">
          <h3>Genel TYT Puanı</h3>
          <div className="score-display">
            <span className="current-score">{studentProgress?.tyt_progress?.overall_tyt_score || 0}</span>
            <span className="target-score">Hedef: {studentProgress?.tyt_progress?.target_tyt_score || 400}</span>
          </div>
        </div>
      </div>

      <div className="net-goals-charts">
        <div className="net-comparison">
          <h4>Net Hedef Karşılaştırması</h4>
          <BarChart width={500} height={300} data={subjectProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="net" fill="#8884d8" name="Mevcut Net" />
            <Bar dataKey="targetNet" fill="#82ca9d" name="Hedef Net" />
          </BarChart>
        </div>

        <div className="subject-distribution">
          <h4>Konu Dağılımı</h4>
          <PieChart width={400} height={300}>
            <Pie
              data={subjectProgress}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ subject, net }) => `${subject}: ${net}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="net"
            >
              {subjectProgress.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="weak-topics">
        <h4>Zayıf Olduğun Konular</h4>
        <div className="topics-list">
          {studentProgress?.tyt_progress?.weakTopics?.map((topic, index) => (
            <div key={index} className="topic-item">
              <span>{topic}</span>
              <button className="practice-btn">Alıştırma Yap</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TYTDashboard;