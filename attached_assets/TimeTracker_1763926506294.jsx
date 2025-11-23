// components/TimeTracker.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);

  const startTracking = async (subject, task) => {
    const session = {
      subject,
      task,
      startTime: serverTimestamp(),
      studentId: 'current-student-id'
    };
    
    const docRef = await addDoc(
      collection(db, 'study_sessions', 'current-student-id', 'sessions'),
      session
    );
    
    setCurrentSession({ id: docRef.id, ...session });
    setIsTracking(true);
  };

  const stopTracking = async () => {
    if (!currentSession) return;
    
    await updateDoc(
      doc(db, 'study_sessions', 'current-student-id', 'sessions', currentSession.id),
      {
        endTime: serverTimestamp(),
        duration: calculateDuration(currentSession.startTime, new Date())
      }
    );
    
    setIsTracking(false);
    setCurrentSession(null);
  };

  return (
    <div className="time-tracker">
      <h3>Study Time Tracker</h3>
      
      {!isTracking ? (
        <div className="tracker-start">
          <select id="subject-select">
            <option value="">Select Subject</option>
            {student?.subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="What are you working on?"
            id="task-input"
          />
          <button onClick={() => {
            const subject = document.getElementById('subject-select').value;
            const task = document.getElementById('task-input').value;
            if (subject && task) startTracking(subject, task);
          }}>
            Start Studying
          </button>
        </div>
      ) : (
        <div className="tracker-active">
          <p>Currently studying: {currentSession?.subject} - {currentSession?.task}</p>
          <button onClick={stopTracking}>Stop</button>
        </div>
      )}
      
      <div className="today-stats">
        <h4>Today's Study Time: {calculateTotalTime(todaySessions)} minutes</h4>
      </div>
    </div>
  );
}