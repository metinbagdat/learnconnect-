// src/components/Quiz/QuizComponent.jsx
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, addDoc, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { Timer, CheckCircle, Cancel } from '@mui/icons-material';

const QuizComponent = ({ quizId, lessonId, courseId }) => {
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    // Load quiz
    const quizDoc = doc(db, 'quizzes', quizId);
    const unsubscribeQuiz = onSnapshot(quizDoc, (doc) => {
      if (doc.exists()) {
        const quizData = doc.data();
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60); // Convert to seconds
      }
    });

    // Load user's attempts
    const attemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', 'currentUserId'),
      where('quizId', '==', quizId),
      orderBy('attemptNumber', 'desc'),
      limit(1)
    );
    const unsubscribeAttempts = onSnapshot(attemptsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const attemptData = snapshot.docs[0].data();
        setAttempt(attemptData);
        setSubmitted(true);
        setResults(attemptData);
      }
    });

    return () => {
      unsubscribeQuiz();
      unsubscribeAttempts();
    };
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Calculate score
    let correctCount = 0;
    const questionResults = quiz.questions.map(question => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: question.id,
        selectedAnswer: answers[question.id] || '',
        isCorrect,
        timeSpent: 0 // We are not tracking per question time for simplicity
      };
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attemptData = {
      userId: 'currentUserId',
      quizId,
      courseId,
      lessonId,
      answers: questionResults,
      score,
      totalPoints: quiz.questions.length,
      earnedPoints: correctCount,
      timeSpent: quiz.timeLimit * 60 - timeLeft,
      completedAt: new Date(),
      attemptNumber: attempt ? attempt.attemptNumber + 1 : 1,
      passed
    };

    try {
      await addDoc(collection(db, 'quizAttempts'), attemptData);
      setSubmitted(true);
      setResults(attemptData);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  if (!quiz) {
    return <Typography>Loading quiz...</Typography>;
  }

  if (submitted && results) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Quiz Results
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ mr: 2 }}>
              {results.score.toFixed(1)}%
            </Typography>
            {results.passed ? (
              <CheckCircle color="success" sx={{ fontSize: 40 }} />
            ) : (
              <Cancel color="error" sx={{ fontSize: 40 }} />
            )}
          </Box>
          <Typography variant="body1" gutterBottom>
            You scored {results.earnedPoints} out of {results.totalPoints} points.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Time spent: {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
          >
            Review Answers
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {quiz.title}
          </Typography>
          <Chip 
            icon={<Timer />} 
            label={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`} 
            color="primary" 
          />
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
            {currentQuestion.question}
          </FormLabel>
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
          >
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel 
                key={index} 
                value={String.fromCharCode(65 + index)} // A, B, C, D
                control={<Radio />} 
                label={option} 
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          >
            Previous
          </Button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;