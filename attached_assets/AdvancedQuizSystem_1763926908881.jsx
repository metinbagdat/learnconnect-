// src/components/Assessment/AdvancedQuizSystem.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
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
  Chip,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

const AdvancedQuizSystem = ({ courseId, topicId }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);

  useEffect(() => {
    loadQuiz();
  }, [courseId, topicId]);

  const loadQuiz = () => {
    const quizQuery = query(
      collection(db, 'quizzes'),
      where('courseId', '==', courseId),
      where('topicId', '==', topicId),
      where('isActive', '==', true)
    );

    return onSnapshot(quizQuery, (snapshot) => {
      if (!snapshot.empty) {
        const quizData = snapshot.docs[0].data();
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60);
      }
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuestionHistory([]);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Track time spent on question
    setQuestionHistory(prev => [...prev, {
      questionId,
      timestamp: new Date(),
      selectedAnswer: answer
    }]);
  };

  const calculateResults = () => {
    if (!quiz) return;

    let correct = 0;
    const questionResults = quiz.questions.map((question, index) => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      if (isCorrect) correct++;
      
      return {
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: answers[question.id],
        isCorrect,
        explanation: question.explanation,
        timeSpent: index > 0 ? 
          (questionHistory[index]?.timestamp - questionHistory[index-1]?.timestamp) / 1000 : 0
      };
    });

    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    setResults({
      score,
      passed,
      correctAnswers: correct,
      totalQuestions: quiz.questions.length,
      questionResults,
      totalTime: quiz.timeLimit * 60 - timeLeft
    });
    setQuizCompleted(true);
  };

  const saveQuizResults = async () => {
    if (!results) return;

    try {
      await addDoc(collection(db, 'quizAttempts'), {
        userId: 'currentUserId',
        courseId,
        topicId,
        quizId: quiz.id,
        score: results.score,
        correctAnswers: results.correctAnswers,
        totalQuestions: results.totalQuestions,
        passed: results.passed,
        timeSpent: results.totalTime,
        answers: results.questionResults,
        completedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const QuizInterface = () => (
    <Card>
      <CardContent>
        {/* Quiz Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            {quiz.title}
          </Typography>
          <Chip 
            icon={<TimerIcon />}
            label={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
            color={timeLeft < 300 ? 'error' : 'primary'}
          />
        </Box>

        {/* Progress */}
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestion + 1) / quiz.questions.length) * 100}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        {/* Current Question */}
        {quiz.questions[currentQuestion] && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Soru {currentQuestion + 1}
              </Typography>
              <Chip 
                label={quiz.questions[currentQuestion].difficulty}
                color={getDifficultyColor(quiz.questions[currentQuestion].difficulty)}
                size="small"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {quiz.questions[currentQuestion].question}
            </Typography>

            {quiz.questions[currentQuestion].imageUrl && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={quiz.questions[currentQuestion].imageUrl} 
                  alt="Question" 
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </Box>
            )}

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={answers[quiz.questions[currentQuestion].id] || ''}
                onChange={(e) => handleAnswer(quiz.questions[currentQuestion].id, e.target.value)}
              >
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={String.fromCharCode(65 + index)}
                    control={<Radio />}
                    label={
                      <Typography variant="body1">
                        {String.fromCharCode(65 + index)}) {option}
                      </Typography>
                    }
                    sx={{ 
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: answers[quiz.questions[currentQuestion].id] === String.fromCharCode(65 + index) 
                        ? 'action.selected' 
                        : 'transparent'
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Önceki
          </Button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Sonraki
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={calculateResults}
            >
              Sınavı Bitir
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const ResultsView = () => (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Sınav Sonuçları
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" color={results.passed ? 'success.main' : 'error.main'} gutterBottom>
            %{results.score.toFixed(1)}
          </Typography>
          <Chip
            label={results.passed ? 'Başarılı' : 'Başarısız'}
            color={results.passed ? 'success' : 'error'}
            size="large"
          />
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {results.correctAnswers}
              </Typography>
              <Typography variant="body2">Doğru Sayısı</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {results.totalQuestions - results.correctAnswers}
              </Typography>
              <Typography variant="body2">Yanlış Sayısı</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="textSecondary">
                {Math.floor(results.totalTime / 60)}:{(results.totalTime % 60).toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body2">Geçen Süre</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {quiz.passingScore}%
              </Typography>
              <Typography variant="body2">Geçme Notu</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Soru Analizi
        </Typography>
        
        <List>
          {results.questionResults.map((result, index) => (
            <ListItem key={index} divider>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {result.isCorrect ? (
                  <CheckIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </Box>
              <ListItemText
                primary={`Soru ${index + 1}`}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      Doğru Cevap: {result.correctAnswer}
                      {!result.isCorrect && ` • Senin Cevabın: ${result.userAnswer || 'Boş'}`}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {result.explanation}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="contained" onClick={saveQuizResults}>
            Sonuçları Kaydet
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (!quiz) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Quiz yükleniyor...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {quiz.description}
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4, textAlign: 'left' }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>📋 Sınav Bilgileri</Typography>
                <Typography>Soru Sayısı: {quiz.questions.length}</Typography>
                <Typography>Süre: {quiz.timeLimit} dakika</Typography>
                <Typography>Geçme Notu: %{quiz.passingScore}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>🎯 İpuçları</Typography>
                <Typography>• Zamanı iyi yönetin</Typography>
                <Typography>• Zor soruları sona bırakın</Typography>
                <Typography>• Tüm şıkları okuyun</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Button variant="contained" size="large" onClick={startQuiz}>
            Sınavı Başlat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return quizCompleted ? <ResultsView /> : <QuizInterface />;
};

export default AdvancedQuizSystem;