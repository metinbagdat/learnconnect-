// src/components/TimeTracking/EnhancedStudyPlanner.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const EnhancedStudyPlanner = () => {
  const [todayPlan, setTodayPlan] = useState(null);
  const [timeSessions, setTimeSessions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadTodayPlan();
    loadTodaySessions();
  }, []);

  const loadTodayPlan = () => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'studyPlans'),
      where('userId', '==', 'currentUserId'),
      where('date', '==', today)
    );
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setTodayPlan(snapshot.docs[0].data());
      }
    });
  };

  const loadTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'timeSessions'),
      where('userId', '==', 'currentUserId'),
      where('date', '==', today)
    );
    
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => doc.data());
      setTimeSessions(sessions);
      generateRecommendations(sessions);
    });
  };

  const generateRecommendations = (sessions) => {
    const recs = [];
    
    // Check for study patterns
    const totalTime = sessions.reduce((total, session) => total + session.duration, 0);
    const avgEfficiency = sessions.reduce((total, session) => total + session.efficiency, 0) / sessions.length;
    
    if (totalTime < 120) {
      recs.push({
        type: 'time',
        message: 'Bugün daha fazla çalışma zamanı ayırmayı düşünün',
        priority: 'high'
      });
    }
    
    if (avgEfficiency < 70) {
      recs.push({
        type: 'efficiency',
        message: 'Çalışma verimliliğinizi artırmak için molaları deneyin',
        priority: 'medium'
      });
    }
    
    setRecommendations(recs);
  };

  const startSessionFromPlan = (activity) => {
    // Start timer with pre-filled activity data
    // This would integrate with the TimeTracker component
    console.log('Starting session for:', activity);
  };

  const getActivityProgress = (activity) => {
    // Calculate progress based on completed time sessions for this activity
    const relatedSessions = timeSessions.filter(
      session => session.subject === activity.subject && session.topic === activity.topic
    );
    const totalTime = relatedSessions.reduce((total, session) => total + session.duration, 0);
    return Math.min(100, (totalTime / activity.duration) * 100);
  };

  if (!todayPlan) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Bugün için plan bulunamadı</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🎯 Gelişmiş Çalışma Planlayıcı
      </Typography>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'info.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Öneriler
            </Typography>
            <Grid container spacing={1}>
              {recommendations.map((rec, index) => (
                <Grid item xs={12} key={index}>
                  <Chip
                    label={rec.message}
                    color={rec.priority === 'high' ? 'error' : 'warning'}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Study Plan with Time Tracking */}
      <Grid container spacing={3}>
        {Object.entries(todayPlan.plan).map(([timeSlot, activities]) => (
          <Grid item xs={12} md={6} key={timeSlot}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {timeSlot === 'morning' ? '🌅 Sabah' : 
                   timeSlot === 'afternoon' ? '☀️ Öğlen' : '🌙 Akşam'}
                  <TimerIcon color="primary" />
                </Typography>
                
                {activities.map((activity, index) => {
                  const progress = getActivityProgress(activity);
                  return (
                    <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {activity.subject}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {activity.topic}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.duration} dakika • {activity.priority} öncelik
                          </Typography>
                        </Box>
                        <IconButton
                          color="primary"
                          onClick={() => startSessionFromPlan(activity)}
                          size="small"
                        >
                          <PlayIcon />
                        </IconButton>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        %{Math.round(progress)} tamamlandı
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Today's Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingIcon /> Bugünkü Özet
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Toplam Süre</Typography>
              <Typography variant="h6">{timeSessions.reduce((total, session) => total + session.duration, 0)} dk</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Ortalama Verim</Typography>
              <Typography variant="h6">
                {timeSessions.length > 0 
                  ? Math.round(timeSessions.reduce((total, session) => total + session.efficiency, 0) / timeSessions.length)
                  : 0}%
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Tamamlanan Hedef</Typography>
              <Typography variant="h6">{timeSessions.filter(s => s.goalsCompleted).length}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="textSecondary">Oturum Sayısı</Typography>
              <Typography variant="h6">{timeSessions.length}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnhancedStudyPlanner;