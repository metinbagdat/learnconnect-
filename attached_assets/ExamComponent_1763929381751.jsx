import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ExamComponent = ({ exam, enrollmentId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60); // in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const submitExam = async () => {
    // Calculate score
    let correctAnswers = 0;
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / exam.questions.length) * 100;

    // Update enrollment with the exam attempt
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    await updateDoc(enrollmentRef, {
      grades: arrayUnion({
        examId: exam.examId,
        attempt: 1, // This should be calculated based on previous attempts
        score: score,
        totalQuestions: exam.questions.length,
        correctAnswers: correctAnswers,
        startedAt: // ...,
        completedAt: new Date()
      })
    });

    // Redirect or show results
  };

  return (
    <div>
      <h2>{exam.title}</h2>
      <div>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      <div>
        <h3>Question {currentQuestion + 1}</h3>
        <p>{exam.questions[currentQuestion].questionText}</p>
        {exam.questions[currentQuestion].options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => setAnswers({ ...answers, [currentQuestion]: option })}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0}>
        Previous
      </button>
      <button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={currentQuestion === exam.questions.length - 1}>
        Next
      </button>
      <button onClick={submitExam}>Submit Exam</button>
    </div>
  );
};

export default ExamComponent;