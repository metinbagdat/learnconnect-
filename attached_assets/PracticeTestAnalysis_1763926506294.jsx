// components/PracticeTestAnalysis.jsx
import React from 'react';

const PracticeTestAnalysis = ({ testData }) => {
  if (!testData) return <div>Test verisi yükleniyor...</div>;

  return (
    <div className="test-analysis">
      <h3>Deneme Sınavı Analizi</h3>
      
      <div className="test-summary">
        <div className="score-breakdown">
          <h4>Net Dağılımı</h4>
          {Object.entries(testData.subjects).map(([subject, data]) => (
            <div key={subject} className="subject-net">
              <span className="subject-name">{translateSubject(subject)}</span>
              <div className="net-bar">
                <div 
                  className="net-fill" 
                  style={{ width: `${(data.net / 40) * 100}%` }}
                >
                  {data.net} Net
                </div>
              </div>
              <span className="details">
                ({data.correct}D, {data.wrong}Y, {data.empty}B)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="weak-areas">
        <h4>Tespit Edilen Zayıf Konular</h4>
        <ul>
          {testData.analysis?.weakTopics?.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>

      <div className="recommendations">
        <h4>Öneriler</h4>
        <p>{testData.analysis?.recommendations}</p>
      </div>

      <div className="time-management">
        <h4>Zaman Yönetimi</h4>
        <p>{testData.analysis?.timeManagement}</p>
      </div>
    </div>
  );
};

const translateSubject = (subject) => {
  const translations = {
    'turkish': 'Türkçe',
    'mathematics': 'Matematik',
    'science': 'Fen Bilimleri',
    'social_sciences': 'Sosyal Bilimler',
    'mathematics_2': 'Matematik-2',
    'turkish_literature': 'Türk Dili ve Edebiyatı'
  };
  return translations[subject] || subject;
};

export default PracticeTestAnalysis;