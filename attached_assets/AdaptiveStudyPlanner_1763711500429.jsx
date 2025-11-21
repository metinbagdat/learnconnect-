// src/components/AI/AdaptiveStudyPlanner.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const AdaptiveStudyPlanner = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [learningStyle, setLearningStyle] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Load user profile and learning preferences
    const userQuery = query(
      collection(db, 'users'),
      where('userId', '==', 'currentUserId')
    );
    
    return onSnapshot(userQuery, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setUserProfile(userData);
        setLearningStyle(userData.learningStyle || {});
      }
    });
  };

  const analyzeLearningStyle = async () => {
    setIsGenerating(true);
    try {
      const analyzeStyle = httpsCallable(functions, 'analyzeLearningStyle');
      const result = await analyzeStyle({
        studySessions: [], // Would pass actual session data
        performanceData: [],
        preferences: userProfile?.preferences
      });
      
      setLearningStyle(result.data);
      setActiveStep(1);
    } catch (error) {
      console.error('Learning style analysis error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAdaptivePlan = async () => {
    setIsGenerating(true);
    try {
      const generatePlan = httpsCallable(functions, 'generateAdaptiveStudyPlan');
      const result = await generatePlan({
        learningStyle,
        goals: userProfile?.goals,
        availableTime: userProfile?.preferences?.dailyStudyHours,
        weakAreas: [], // From performance data
        strengths: [] // From performance data
      });
      
      setAiPlan(result.data);
      setActiveStep(2);
    } catch (error) {
      console.error('Plan generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const LearningStyleAssessment = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon sx={{ mr: 1 }} />
          Öğrenme Stili Analizi
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          AI, çalışma alışkanlıklarınızı analiz ederek en uygun öğrenme stilini belirleyecek.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Görsel Öğrenen
              </Typography>
              <Typography variant="body2">
                • Diyagramlar ve grafikler<br/>
                • Renkli notlar<br/>
                • Video dersler<br/>
                • Mind mapping
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                İşitsel Öğrenen
              </Typography>
              <Typography variant="body2">
                • Ses kayıtları<br/>
                • Grup tartışmaları<br/>
                • Müzik eşliğinde çalışma<br/>
                • Yüksek sesle tekrar
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Kinestetik Öğrenen
              </Typography>
              <Typography variant="body2">
                • Uygulamalı çalışma<br/>
                • Fiziksel aktivite<br/>
                • Rol yapma<br/>
                • Kısa molalar
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Oku/Yaz Öğrenen
              </Typography>
              <Typography variant="body2">
                • Detaylı notlar<br/>
                • Okuma materyalleri<br/>
                • Yazma alıştırmaları<br/>
                • Liste yapma
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={analyzeLearningStyle}
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} /> : <AIIcon />}
          >
            {isGenerating ? 'Analiz Yapılıyor...' : 'Öğrenme Stilimi Analiz Et'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const LearningStyleResults = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎯 Öğrenme Stiliniz: {learningStyle?.primaryStyle}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {learningStyle?.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Önerilen Çalışma Teknikleri:
            </Typography>
            <Grid container spacing={1}>
              {learningStyle?.recommendedTechniques?.map((tech, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Chip label={tech} color="primary" variant="outlined" sx={{ mb: 1 }} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
              <Typography variant="h6" gutterBottom>
                Stil Dağılımı
              </Typography>
              {Object.entries(learningStyle?.styleDistribution || {}).map(([style, percentage]) => (
                <Box key={style} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{style}</Typography>
                    <Typography variant="body2">{percentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentage} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={generateAdaptivePlan}
            disabled={isGenerating}
          >
            {isGenerating ? 'Plan Oluşturuluyor...' : 'Kişiselleştirilmiş Plan Oluştur'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const AdaptivePlan = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon sx={{ mr: 1 }} />
          AI Destekli Uyarlanabilir Çalışma Planı
        </Typography>

        <Alert severity="success" sx={{ mb: 3 }}>
          Planınız öğrenme stilinize ve performans verilerinize göre optimize edilmiştir.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📊 Plan Özeti
              </Typography>
              <Typography variant="body2" paragraph>
                {aiPlan?.summary}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Toplam Çalışma Süresi
                </Typography>
                <Typography variant="h6">
                  {aiPlan?.totalStudyTime} dakika
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Önerilen Çalışma Saatleri
                </Typography>
                <Typography variant="h6">
                  {aiPlan?.recommendedSchedule}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎯 Odaklanılacak Alanlar
              </Typography>
              {aiPlan?.focusAreas?.map((area, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {area.subject} - {area.topic}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {area.reason}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`${area.priority} öncelik`} size="small" />
                    <Chip label={`${area.estimatedTime}d`} size="small" />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📝 Günlük Plan
              </Typography>
              <Stepper orientation="vertical">
                {aiPlan?.dailyPlan?.map((day, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Typography variant="subtitle1">Gün {index + 1}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Grid container spacing={2}>
                        {day.sessions?.map((session, sessionIndex) => (
                          <Grid item xs={12} md={6} key={sessionIndex}>
                            <Paper sx={{ p: 2, borderLeft: 3, borderColor: 'primary.main' }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {session.time} - {session.subject}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                {session.activity}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label={session.duration} size="small" />
                                <Chip label={session.technique} size="small" variant="outlined" />
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const steps = [
    {
      label: 'Öğrenme Stili Analizi',
      description: 'AI ile öğrenme stilinizi belirleyin',
      component: <LearningStyleAssessment />
    },
    {
      label: 'Stil Sonuçları',
      description: 'Öğrenme stilinize özel öneriler',
      component: <LearningStyleResults />
    },
    {
      label: 'Uyarlanabilir Plan',
      description: 'Kişiselleştirilmiş çalışma planı',
      component: <AdaptivePlan />
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <AIIcon sx={{ mr: 2 }} />
        AI Destekli Uyarlanabilir Öğrenme Sistemi
      </Typography>

      <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {steps[activeStep].component}
    </Box>
  );
};

export default AdaptiveStudyPlanner;