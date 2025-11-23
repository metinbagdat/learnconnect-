// components/TopicTracker.jsx
import React, { useState, useEffect } from 'react';

const TopicTracker = ({ studentId, examType = 'TYT' }) => {
  const [topics, setTopics] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch topics based on exam type
    loadTopics(examType);
  }, [examType]);

  const loadTopics = async (type) => {
    // Implementation to load topics from Firestore
    const topicsData = await fetchTopics(type, studentId);
    setTopics(topicsData);
  };

  const updateTopicProgress = async (topicId, proficiency) => {
    // Update topic progress in Firestore
    await updateTopicProficiency(studentId, topicId, proficiency);
    loadTopics(examType);
  };

  const filteredTopics = topics.filter(topic => {
    if (filter === 'all') return true;
    if (filter === 'weak') return topic.proficiency < 50;
    if (filter === 'medium') return topic.proficiency >= 50 && topic.proficiency < 80;
    if (filter === 'strong') return topic.proficiency >= 80;
    return true;
  });

  return (
    <div className="topic-tracker">
      <div className="tracker-header">
        <h3>{examType} Konu Takibi</h3>
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button 
            className={filter === 'weak' ? 'active' : ''}
            onClick={() => setFilter('weak')}
          >
            Zayıf
          </button>
          <button 
            className={filter === 'medium' ? 'active' : ''}
            onClick={() => setFilter('medium')}
          >
            Orta
          </button>
          <button 
            className={filter === 'strong' ? 'active' : ''}
            onClick={() => setFilter('strong')}
          >
            Güçlü
          </button>
        </div>
      </div>

      <div className="topics-grid">
        {filteredTopics.map(topic => (
          <div key={topic.id} className={`topic-card proficiency-${getProficiencyLevel(topic.proficiency)}`}>
            <div className="topic-header">
              <h4>{topic.name}</h4>
              <span className="proficiency-badge">{topic.proficiency}%</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${topic.proficiency}%` }}
              ></div>
            </div>

            <div className="topic-actions">
              <button 
                className="study-btn"
                onClick={() => startStudySession(topic)}
              >
                Çalış
              </button>
              <button 
                className="practice-btn"
                onClick={() => startPractice(topic)}
              >
                Soru Çöz
              </button>
            </div>

            <div className="proficiency-controls">
              <small>Yeterlilik:</small>
              <button onClick={() => updateTopicProgress(topic.id, Math.max(0, topic.proficiency - 10))}>-</button>
              <button onClick={() => updateTopicProgress(topic.id, Math.min(100, topic.proficiency + 10))}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getProficiencyLevel = (proficiency) => {
  if (proficiency < 40) return 'weak';
  if (proficiency < 70) return 'medium';
  return 'strong';
};

export default TopicTracker;