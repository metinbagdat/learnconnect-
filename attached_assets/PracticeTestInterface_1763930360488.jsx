// components/Tests/PracticeTestInterface.jsx
import React, { useState, useEffect } from 'react';
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';

const PracticeTestInterface = ({ studentId, onTestCompleted }) => {
  const [testType, setTestType] = useState('TYT');
  const [currentSubject, setCurrentSubject] = useState('');
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const TEST_CONFIG = {
    TYT: {
      subjects: {
        turkish: { questions: 40, time: 60 },
        mathematics: { questions: 40, time: 75 },
        social_sciences: { questions: 20, time: 25 },
        science: { questions: 20, time: 30 }
      },
      totalTime: 165
    },
    AYT: {
      subjects: {
        mathematics_2: { questions: 40, time: 90 },
        turkish_literature: { questions: 24, time: 45 },
        social_1: { questions: 12, time: 25 },
        science_2: { questions: 40, time: 75 }
      },
      totalTime: 180
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentSubject(Object.keys(TEST_CONFIG[testType].subjects)[0]);
    setTimeRemaining(TEST_CONFIG[testType].totalTime * 60); // Convert to seconds
    setAnswers({});
    setCurrentQuestion(1);
  };

  const handleAnswer = (questionNumber, answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentSubject]: {
        ...prev[currentSubject],
        [questionNumber]: answer
      }
    }));
  };

  const nextSubject = () => {
    const subjects = Object.keys(TEST_CONFIG[testType].subjects);
    const currentIndex = subjects.indexOf(currentSubject);
    
    if (currentIndex < subjects.length - 1) {
      setCurrentSubject(subjects[currentIndex + 1]);
      setCurrentQuestion(1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    const testResults = calculateTestResults();
    
    try {
      const testRef = await addDoc(
        collection(db, 'practice_tests', studentId, 'tests'),
        {
          testType: testType,
          testDate: serverTimestamp(),
          subjects: testResults.subjects,
          answers: answers,
          duration: TEST_CONFIG[testType].totalTime * 60 - timeRemaining,
          completed: true
        }
      );

      setTestStarted(false);
      onTestCompleted(testRef.id, testResults);
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const calculateTestResults = () => {
    const results = { subjects: {} };
    
    Object.keys(TEST_CONFIG[testType].subjects).forEach(subject => {
      const subjectConfig = TEST_CONFIG[testType].subjects[subject];
      const subjectAnswers = answers[subject] || {};
      
      let correct = 0;
      let wrong = 0;
      let empty = subjectConfig.questions;
      
      Object.values(subjectAnswers).forEach(answer => {
        if (answer === 'correct') {
          correct++;
          empty--;
        } else if (answer === 'wrong') {
          wrong++;
          empty--;
        }
      });
      
      results.subjects[subject] = {
        correct: correct,
        wrong: wrong,
        empty: empty,
        net: correct - (wrong * 0.25)
      };
    });
    
    return results;
  };

  // Timer effect
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!testStarted) {
    return (
      <div className="practice-test-setup">
        <h3>Deneme Sınavı</h3>
        
        <div className="test-config">
          <div className="config-item">
            <label>Sınav Türü:</label>
            <select value={testType} onChange={(e) => setTestType(e.target.value)}>
              <option value="TYT">TYT</option>
              <option value="AYT">AYT</option>
              <option value="TYT-AYT">TYT-AYT</option>
            </select>
          </div>
          
          <div className="test-info">
            <h4>{testType} Bilgileri</h4>
            <div className="subject-list">
              {Object.entries(TEST_CONFIG[testType].subjects).map(([subject, config]) => (
                <div key={subject} className="subject-info">
                  <span className="subject-name">{translateSubject(subject)}</span>
                  <span className="question-count">{config.questions} Soru</span>
                  <span className="time-allocation">{config.time} Dakika</span>
                </div>
              ))}
            </div>
            
            <div className="total-info">
              <strong>Toplam: {Object.values(TEST_CONFIG[testType].subjects).reduce((sum, config) => sum + config.questions, 0)} Soru</strong>
              <strong>{TEST_CONFIG[testType].totalTime} Dakika</strong>
            </div>
          </div>
          
          <button className="start-test-btn" onClick={startTest}>
            Sınavı Başlat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-test-interface">
      {/* Test Header */}
      <div className="test-header">
        <div className="test-info">
          <h3>{testType} Deneme Sınavı</h3>
          <span className="current-subject">{translateSubject(currentSubject)}</span>
        </div>
        
        <div className="test-timer">
          <div className="timer-display">
            {formatTime(timeRemaining)}
          </div>
          <div className="progress-info">
            Soru {currentQuestion} / {TEST_CONFIG[testType].subjects[currentSubject].questions}
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="question-navigation">
        {Array.from({ length: TEST_CONFIG[testType].subjects[currentSubject].questions }, (_, i) => i + 1).map(qNum => (
          <button
            key={qNum}
            className={`question-nav-btn ${
              currentQuestion === qNum ? 'active' : ''
            } ${
              answers[currentSubject]?.[qNum] === 'correct' ? 'correct' : 
              answers[currentSubject]?.[qNum] === 'wrong' ? 'wrong' : ''
            }`}
            onClick={() => setCurrentQuestion(qNum)}
          >
            {qNum}
          </button>
        ))}
      </div>

      {/* Question Interface */}
      <div className="question-interface">
        <div className="question-header">
          <h4>Soru {currentQuestion}</h4>
        </div>
        
        <div className="question-content">
          {/* This would be replaced with actual question content */}
          <div className="question-placeholder">
            <p>Burada soru içeriği görünecek...</p>
          </div>
        </div>
        
        <div className="answer-actions">
          <button 
            className="answer-btn correct"
            onClick={() => handleAnswer(currentQuestion, 'correct')}
          >
            Doğru
          </button>
          <button 
            className="answer-btn wrong"
            onClick={() => handleAnswer(currentQuestion, 'wrong')}
          >
            Yanlış
          </button>
          <button 
            className="answer-btn empty"
            onClick={() => handleAnswer(currentQuestion, '')}
          >
            Boş
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="test-controls">
        <button 
          className="control-btn prev"
          disabled={currentQuestion === 1}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
        >
          Önceki
        </button>
        
        {currentQuestion < TEST_CONFIG[testType].subjects[currentSubject].questions ? (
          <button 
            className="control-btn next"
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            Sonraki
          </button>
        ) : (
          <button 
            className="control-btn finish-subject"
            onClick={nextSubject}
          >
            {Object.keys(TEST_CONFIG[testType].subjects).indexOf(currentSubject) < 
             Object.keys(TEST_CONFIG[testType].subjects).length - 1 ? 'Sonraki Bölüm' : 'Sınavı Bitir'}
          </button>
        )}
      </div>
    </div>
  );
};

const translateSubject = (subject) => {
  const translations = {
    'turkish': 'Türkçe',
    'mathematics': 'Matematik',
    'social_sciences': 'Sosyal Bilimler',
    'science': 'Fen Bilimleri',
    'mathematics_2': 'Matematik-2',
    'turkish_literature': 'Türk Dili ve Edebiyatı',
    'social_1': 'Sosyal Bilimler-1',
    'science_2': 'Fen Bilimleri-2'
  };
  return translations[subject] || subject;
};

export default PracticeTestInterface;