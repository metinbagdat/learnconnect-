// src/components/Exams/ExamPortal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import NetCalculator from './NetCalculator';
import RealTimeResults from './RealTimeResults';
import './ExamPortal.css';

const ExamPortal: React.FC<{ examId: string }> = ({ examId }) => {
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'Exams', examId), (doc) => {
      if (doc.exists()) {
        setExam(doc.data() as Exam);
      }
    });

    return unsubscribe;
  }, [examId]);

  const startExam = () => {
    if (!exam) return;
    
    setExamStarted(true);
    setTimeLeft(exam.duration * 60); // Convert to seconds
    setAnswers(Array(exam.questions.length).fill(null));
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishExam = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const netScore = calculateNetScore(answers, exam.questions);
    const examResult: ExamResult = {
      userId: user.uid,
      examId,
      answers,
      netScore,
      completedAt: new Date(),
      timeSpent: exam.duration * 60 - timeLeft
    };

    // Save result
    await updateDoc(doc(db, 'Enrollments', getEnrollmentId(user.uid, exam.courseId)), {
      grades: arrayUnion(examResult)
    });

    setExamCompleted(true);
  };

  const handleAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      questionId: exam.questions[questionIndex].id,
      selectedAnswer: answer,
      isCorrect: answer === exam.questions[questionIndex].correctAnswer,
      timestamp: new Date()
    };
    
    setAnswers(newAnswers);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam) {
    return <div>Yükleniyor...</div>;
  }

  if (!examStarted) {
    return (
      <div className="exam-intro">
        <h1>{exam.title}</h1>
        <div className="exam-info">
          <p><strong>Süre:</strong> {exam.duration} dakika</p>
          <p><strong>Soru Sayısı:</strong> {exam.questions.length}</p>
          <p><strong>Geçme Notu:</strong> %{exam.passingScore * 100}</p>
        </div>
        <button className="btn-primary" onClick={startExam}>
          Sınavı Başlat
        </button>
      </div>
    );
  }

  if (examCompleted) {
    return <RealTimeResults exam={exam} answers={answers} />;
  }

  return (
    <div className="exam-portal">
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="exam-timer">
          <span className={timeLeft < 300 ? 'warning' : ''}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="exam-content">
        <div className="question-navigation">
          {exam.questions.map((_, index) => (
            <button
              key={index}
              className={`nav-btn ${currentQuestion === index ? 'active' : ''} ${
                answers[index] ? 'answered' : ''
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-area">
          <div className="question-header">
            <h3>Soru {currentQuestion + 1}</h3>
            <span className="question-points">
              {exam.questions[currentQuestion].points} puan
            </span>
          </div>

          <div className="question-text">
            {exam.questions[currentQuestion].question}
          </div>

          <div className="answer-options">
            {exam.questions[currentQuestion].options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion]?.selectedAnswer === option}
                  onChange={() => handleAnswer(currentQuestion, option)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>

          <div className="question-navigation-buttons">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Önceki
            </button>
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={currentQuestion === exam.questions.length - 1}
            >
              Sonraki
            </button>
            {currentQuestion === exam.questions.length - 1 && (
              <button className="btn-finish" onClick={finishExam}>
                Sınavı Bitir
              </button>
            )}
          </div>
        </div>

        <div className="exam-sidebar">
          <NetCalculator answers={answers} questions={exam.questions} />
          <div className="progress-summary">
            <h4>İlerleme</h4>
            <p>Cevaplanan: {answers.filter(a => a).length}/{exam.questions.length}</p>
            <p>Boş: {exam.questions.length - answers.filter(a => a).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPortal;