// src/components/TimeTracking/TimeTracker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

const TimeTracker = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [newSessionDialog, setNewSessionDialog] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    topic: '',
    taskType: 'study',
    goals: '',
    notes: ''
  });

  useEffect(() => {
    loadTodaySessions();
    loadDailyGoal();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'timeSessions'),
      where('userId', '==', 'currentUserId'), // Replace with actual user
      where('date', '==', today),
      orderBy('startTime', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodaySessions(sessionsData);
      
      // Calculate total study time for today
      const totalTime = sessionsData.reduce((total, session) => total + session.duration, 0);
      setTodayStudyTime(totalTime);
    });
  };

  const loadDailyGoal = () => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'dailyGoals'),
      where('userId', '==', 'currentUserId'),
      where('date', '==', today)
    );
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setDailyGoal(snapshot.docs[0].data());
      }
    });
  };

  const startTimer = () => {
    if (!sessionForm.subject) {
      alert('Lütfen bir ders seçin');
      return;
    }

    const newSession = {
      userId: 'currentUserId',
      ...sessionForm,
      startTime: serverTimestamp(),
      isActive: true,
      distractions: 0,
      mood: 'focused'
    };

    setCurrentSession(newSession);
    setIsRunning(true);
    setTimer(0);
    
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    setNewSessionDialog(false);
  };

  const stopTimer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRunning(false);
    const duration = Math.floor(timer / 60); // Convert to minutes

    try {
      // Save session to Firestore
      await addDoc(collection(db, 'timeSessions'), {
        ...currentSession,
        endTime: serverTimestamp(),
        duration: duration,
        completed: true,
        efficiency: calculateEfficiency(duration, currentSession.goals),
        date: new Date().toISOString().split('T')[0]
      });

      // Update daily goal progress
      await updateDailyGoal(duration, currentSession.subject);

      setCurrentSession(null);
      setTimer(0);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const calculateEfficiency = (duration, goals) => {
    // Simple efficiency calculation based on session length and goals
    const baseEfficiency = 80;
    const timeBonus = Math.min(20, duration / 3); // Bonus for longer sessions
    return Math.min(100, baseEfficiency + timeBonus);
  };

  const updateDailyGoal = async (duration, subject) => {
    const today = new Date().toISOString().split('T')[0];
    
    // This would update or create daily goal document
    // Implementation depends on your daily goals structure
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayProgress = () => {
    if (!dailyGoal) return 0;
    const totalTime = todaySessions.reduce((total, session) => total + session.duration, 0);
    return Math.min(100, (totalTime / dailyGoal.targetStudyTime) * 100);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        ⏱️ Zaman Takip Sistemi
      </Typography>

      <Grid container spacing={3}>
        {/* Current Session Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: isRunning ? 'success.50' : 'grey.50' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              {isRunning ? (
                <>
                  <Typography variant="h3" gutterBottom color="success.main">
                    {formatTime(timer)}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {currentSession?.subject} - {currentSession?.topic}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<StopIcon />}
                    onClick={stopTimer}
                    sx={{ mt: 2 }}
                  >
                    Durdur
                  </Button>
                </>
              ) : (
                <>
                  <TimerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Çalışma Oturumu Başlat
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={() => setNewSessionDialog(true)}
                  >
                    Başlat
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Günlük Hedef
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {todaySessions.reduce((total, session) => total + session.duration, 0)} dakika / {dailyGoal?.targetStudyTime || 240} dakika
                  </Typography>
                </Box>
                <Typography variant="body2" color="primary">
                  %{Math.round(getTodayProgress())}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={getTodayProgress()} 
                  size={80}
                  thickness={4}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {Math.round(getTodayProgress())}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {todaySessions.length} oturum • {todaySessions.filter(s => s.goalsCompleted).length} tamamlanan hedef
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Sessions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Bugünkü Oturumlar
              </Typography>
              {todaySessions.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Henüz oturum kaydı bulunmuyor
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {todaySessions.map((session) => (
                    <Grid item xs={12} sm={6} md={4} key={session.id}>
                      <Paper sx={{ p: 2, borderLeft: 4, borderColor: 'success.main' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {session.subject}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {session.topic}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {session.duration} dakika
                          </Typography>
                          <Chip 
                            label={`%${session.efficiency}`}
                            size="small"
                            color={session.efficiency >= 80 ? 'success' : session.efficiency >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                        {session.notes && (
                          <Typography variant="caption" color="textSecondary">
                            {session.notes}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Session Dialog */}
      <Dialog open={newSessionDialog} onClose={() => setNewSessionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Çalışma Oturumu</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Ders</InputLabel>
            <Select
              value={sessionForm.subject}
              onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
              label="Ders"
            >
              <MenuItem value="Matematik">Matematik</MenuItem>
              <MenuItem value="Fizik">Fizik</MenuItem>
              <MenuItem value="Kimya">Kimya</MenuItem>
              <MenuItem value="Biyoloji">Biyoloji</MenuItem>
              <MenuItem value="Tarih">Tarih</MenuItem>
              <MenuItem value="Edebiyat">Edebiyat</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Konu/Başlık"
            value={sessionForm.topic}
            onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
            sx={{ mt: 2 }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Görev Türü</InputLabel>
            <Select
              value={sessionForm.taskType}
              onChange={(e) => setSessionForm({ ...sessionForm, taskType: e.target.value })}
              label="Görev Türü"
            >
              <MenuItem value="study">Ders Çalışma</MenuItem>
              <MenuItem value="practice">Problem Çözme</MenuItem>
              <MenuItem value="review">Tekrar</MenuItem>
              <MenuItem value="exam_prep">Sınav Hazırlığı</MenuItem>
              <MenuItem value="homework">Ödev</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Hedefler"
            value={sessionForm.goals}
            onChange={(e) => setSessionForm({ ...sessionForm, goals: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
            placeholder="Bu oturumda neler yapmayı planlıyorsunuz?"
          />

          <TextField
            fullWidth
            label="Notlar"
            value={sessionForm.notes}
            onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
            sx={{ mt: 2 }}
            multiline
            rows={2}
            placeholder="Ek notlar..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSessionDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            onClick={startTimer}
            disabled={!sessionForm.subject}
          >
            Başlat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTracker;