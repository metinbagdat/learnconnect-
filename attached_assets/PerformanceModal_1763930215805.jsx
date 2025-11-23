// src/components/Performance/PerformanceModal.jsx
import React, { useState } from 'react';
import './PerformanceModal.css';

const PerformanceModal = ({ task, onSubmit, onClose }) => {
  const [performance, setPerformance] = useState({
    score: 0,
    time_spent: task.duration, // default to planned duration
    accuracy: 100,
    confidence: 5, // 1-5 scale
    difficulty_perception: 'appropriate', // 'too_easy', 'appropriate', 'too_hard'
    engagement_level: 3 // 1-5 scale
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(performance);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Görev Performansı</h2>
        <p>
          <strong>{task.subject}</strong> - {task.topic_name_tr}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Puan (0-100):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={performance.score}
              onChange={(e) => setPerformance({ ...performance, score: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label>Harcanan Süre (dakika):</label>
            <input
              type="number"
              min="1"
              value={performance.time_spent}
              onChange={(e) => setPerformance({ ...performance, time_spent: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label>Doğruluk (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={performance.accuracy}
              onChange={(e) => setPerformance({ ...performance, accuracy: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label>Kendine Güven (1-5):</label>
            <select
              value={performance.confidence}
              onChange={(e) => setPerformance({ ...performance, confidence: parseInt(e.target.value) })}
            >
              <option value={1}>1 - Çok Düşük</option>
              <option value={2}>2 - Düşük</option>
              <option value={3}>3 - Orta</option>
              <option value={4}>4 - Yüksek</option>
              <option value={5}>5 - Çok Yüksek</option>
            </select>
          </div>

          <div className="form-group">
            <label>Görev Zorluğu:</label>
            <select
              value={performance.difficulty_perception}
              onChange={(e) => setPerformance({ ...performance, difficulty_perception: e.target.value })}
            >
              <option value="too_easy">Çok Kolay</option>
              <option value="appropriate">Uygun</option>
              <option value="too_hard">Çok Zor</option>
            </select>
          </div>

          <div className="form-group">
            <label>İlgi Düzeyi (1-5):</label>
            <select
              value={performance.engagement_level}
              onChange={(e) => setPerformance({ ...performance, engagement_level: parseInt(e.target.value) })}
            >
              <option value={1}>1 - Çok Düşük</option>
              <option value={2}>2 - Düşük</option>
              <option value={3}>3 - Orta</option>
              <option value={4}>4 - Yüksek</option>
              <option value={5}>5 - Çok Yüksek</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-submit">
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceModal;