// src/components/Study/StudyTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import './StudyTimer.css';

const StudyTimer = ({ task, onTimerComplete }) => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(task.duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('study'); // 'study' or 'break'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);

    if (mode === 'study') {
      setSessionsCompleted(prev => prev + 1);
      
      // Log study session
      try {
        const sessionRef = doc(db, 'StudySessions', `${user.uid}_${Date.now()}`);
        await updateDoc(sessionRef, {
          student_id: user.uid,
          task_id: task.task_id,
          subject: task.subject,
          topic: task.topic_name_tr,
          duration: task.duration,
          completed_at: new Date(),
          session_type: 'pomodoro'
        });
      } catch (error) {
        console.error('Error logging study session:', error);
      }

      // Switch to break mode if less than 4 sessions completed
      if (sessionsCompleted < 3) {
        setMode('break');
        setTimeLeft(5 * 60); // 5-minute break
        setIsRunning(true);
      } else {
        // Long break after 4 sessions
        setMode('break');
        setTimeLeft(15 * 60); // 15-minute break
        setIsRunning(true);
        setSessionsCompleted(0);
      }
    } else {
      // Break completed, switch back to study
      setMode('study');
      setTimeLeft(task.duration * 60);
      onTimerComplete?.();
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(task.duration * 60);
    setMode('study');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (task.duration * 60)) * 100;

  return (
    <div className={`study-timer ${mode}`}>
      <div className="timer-header">
        <h3>Çalışma Zamanlayıcı</h3>
        <div className="session-counter">
          {sessionsCompleted}/4 Pomodoro
        </div>
      </div>

      <div className="timer-display">
        <div className="time-circle">
          <svg className="progress-ring" width="200" height="200">
            <circle
              stroke={mode === 'study' ? '#4CAF50' : '#FF9800'}
              strokeWidth="8"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
              style={{
                strokeDasharray: 565.48,
                strokeDashoffset: 565.48 - (565.48 * progress) / 100
              }}
            />
          </svg>
          <div className="time-text">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="mode-label">
              {mode === 'study' ? 'Çalışma' : 'Mola'}
            </div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="control-btn start-btn" onClick={startTimer}>
            ▶️ Başlat
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={pauseTimer}>
            ⏸️ Duraklat
          </button>
        )}
        
        <button className="control-btn reset-btn" onClick={resetTimer}>
          🔄 Sıfırla
        </button>
      </div>

      <div className="timer-info">
        <div className="info-item">
          <span className="label">Görev:</span>
          <span className="value">{task.topic_name_tr}</span>
        </div>
        <div className="info-item">
          <span className="label">Ders:</span>
          <span className="value">{task.subject}</span>
        </div>
        <div className="info-item">
          <span className="label">Hedef:</span>
          <span className="value">{task.duration} dakika</span>
        </div>
      </div>

      {mode === 'break' && (
        <div className="break-suggestions">
          <h4>Mola Önerileri:</h4>
          <ul>
            <li>💧 Su iç</li>
            <li>🚶 Kısa bir yürüyüş yap</li>
            <li>🧘 Gözlerini dinlendir</li>
            <li>🎵 Müzik dinle</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;