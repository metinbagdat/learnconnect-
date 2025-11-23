// src/components/TYT/TYTDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ChartIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TYTDashboard = () => {
  const [tytGoals, setTytGoals] = useState(null);
  const [tytTests, setTytTests] = useState([]);
  const [topicProgress, setTopicProgress] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [addTestDialog, setAddTestDialog] = useState(false);
  const [newTest, setNewTest] = useState({
    testNumber: '',
    testDate: new Date().toISOString().split('T')[0],
    subjects: {
      "Türkçe": { correct: 0, wrong: 0, empty: 40 },
      "Matematik": { correct: 0, wrong: 0, empty: 40 },
      "Sosyal Bilimler": { correct: 0, wrong: 0, empty: 20 },
      "Fen Bilimleri": { correct: 0, wrong: 0, empty: 20 }
    }
  });

  useEffect(() => {
    loadTYTData();
  }, []);

  const loadTYTData = () => {
    // Load TYT Goals
    const goalsQuery = query(
      collection(db, 'tytGoals'),
      where('userId', '==', 'currentUserId')
    );
    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      if (!snapshot.empty) {
        setTytGoals(snapshot.docs[0].data());
      }
    });

    // Load TYT Tests
    const testsQuery = query(
      collection(db, 'tytTests'),
      where('userId', '==', 'currentUserId'),
      where('examType', '==', 'TYT')
    );
    const unsubscribeTests = onSnapshot(testsQuery, (snapshot) => {
      setTytTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Load Topic Progress
    const progressQuery = query(
      collection(db, 'topicProgress'),
      where('userId', '==', 'currentUserId')
    );
    const unsubscribeProgress = onSnapshot(progressQuery, (snapshot) => {
      setTopicProgress(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Load Tasks
    const tasksQuery = query(
      collection(db, 'studyTasks'),
      where('userId', '==', 'currentUserId'),
      where('completed', '==', false)
    );
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeGoals();
      unsubscribeTests();
      unsubscribeProgress();
      unsubscribeTasks();
    };
  };

  const calculateNet = (correct, wrong, total = 40) => {
    return correct - (wrong / 4);
  };

  const calculateTYTScore = (subjects) => {
    let totalScore = 100; // Base score
    Object.values(subjects).forEach(subject => {
      const net = calculateNet(subject.correct, subject.wrong);
      totalScore += net * 1.32; // TYT coefficient
    });
    return Math.round(totalScore);
  };

  const handleAddTest = async () => {
    try {
      const subjectsWithNet = {};
      Object.entries(newTest.subjects).forEach(([subject, data]) => {
        subjectsWithNet[subject] = {
          ...data,
          net: calculateNet(data.correct, data.wrong)
        };
      });

      const testData = {
        userId: 'currentUserId',
        examType: 'TYT',
        ...newTest,
        subjects: subjectsWithNet,
        totalScore: calculateTYTScore(subjectsWithNet),
        createdAt: new Date()
      };

      await addDoc(collection(db, 'tytTests'), testData);
      setAddTestDialog(false);
      setNewTest({
        testNumber: '',
        testDate: new Date().toISOString().split('T')[0],
        subjects: {
          "Türkçe": { correct: 0, wrong: 0, empty: 40 },
          "Matematik": { correct: 0, wrong: 0, empty: 40 },
          "Sosyal Bilimler": { correct: 0, wrong: 0, empty: 20 },
          "Fen Bilimleri": { correct: 0, wrong: 0, empty: 20 }
        }
      });
    } catch (error) {
      console.error('Test ekleme hatası:', error);
    }
  };

  const getProgressData = () => {
    return tytTests.map(test => ({
      date: test.testDate,
      score: test.totalScore,
      net: Object.values(test.subjects).reduce((total, subject) => total + subject.net, 0)
    }));
  };

  const getSubjectPerformance = () => {
    const performance = {};
    tytTests.forEach(test => {
      Object.entries(test.subjects).forEach(([subject, data]) => {
        if (!performance[subject]) {
          performance[subject] = [];
        }
        performance[subject].push(data.net);
      });
    });

    return Object.entries(performance).map(([subject, nets]) => ({
      subject,
      averageNet: nets.reduce((a, b) => a + b, 0) / nets.length,
      trend: nets[nets.length - 1] - nets[0]
    }));
  };

  const getWeakTopics = () => {
    return topicProgress
      .filter(topic => topic.masteryLevel < 70)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .slice(0, 5);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        🎯 TYT (Temel Yeterlilik Testi) Takip Sistemi
      </Typography>

      {!tytGoals && (
        <Card sx={{ mb: 3, bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              TYT Hedefi Belirleyin
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              TYT hazırlık sürecinizi takip etmek için hedeflerinizi belirleyin.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              TYT Hedefi Oluştur
            </Button>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Overall Progress */}
        {tytGoals && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    Genel İlerleme
                  </Typography>
                  <Chip 
                    label={`Hedef: ${tytGoals.targetScore} Puan`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {tytGoals.currentScore} Puan
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Mevcut TYT Puanı
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(tytGoals.currentScore / tytGoals.targetScore) * 100} 
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      %{Math.round((tytGoals.currentScore / tytGoals.targetScore) * 100)} tamamlandı
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Ders Bazlı Net Hedefleri</Typography>
                    {Object.entries(tytGoals.subjects).map(([subject, data]) => (
                      <Box key={subject} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{subject}</Typography>
                          <Typography variant="body2">
                            {data.currentNet.toFixed(1)} / {data.targetNet} Net
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(data.currentNet / data.targetNet) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Tests */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  📊 Son Deneme Sınavları
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => setAddTestDialog(true)}
                >
                  Yeni Deneme Ekle
                </Button>
              </Box>

              {tytTests.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Henüz deneme sınavı eklenmemiş
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Deneme No</TableCell>
                        <TableCell>Tarih</TableCell>
                        <TableCell>Toplam Net</TableCell>
                        <TableCell>Puan</TableCell>
                        <TableCell>Türkçe</TableCell>
                        <TableCell>Matematik</TableCell>
                        <TableCell>Sosyal</TableCell>
                        <TableCell>Fen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tytTests.slice(0, 5).map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>#{test.testNumber}</TableCell>
                          <TableCell>{test.testDate}</TableCell>
                          <TableCell>
                            <strong>
                              {Object.values(test.subjects).reduce((total, subject) => total + subject.net, 0).toFixed(1)}
                            </strong>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={test.totalScore} 
                              color={test.totalScore >= 400 ? "success" : test.totalScore >= 350 ? "warning" : "error"}
                              size="small"
                            />
                          </TableCell>
                          {['Türkçe', 'Matematik', 'Sosyal Bilimler', 'Fen Bilimleri'].map(subject => (
                            <TableCell key={subject}>
                              {test.subjects[subject]?.net.toFixed(1)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weak Topics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚠️ Geliştirilmesi Gereken Konular
              </Typography>
              
              {getWeakTopics().length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Tüm konular yeterli seviyede
                </Typography>
              ) : (
                <Box>
                  {getWeakTopics().map((topic) => (
                    <Paper key={topic.id} sx={{ p: 2, mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {topic.subject} - {topic.topic}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={topic.masteryLevel} 
                          sx={{ flexGrow: 1, height: 8 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          %{topic.masteryLevel}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Puan Gelişim Grafiği
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    name="TYT Puanı"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke="#82ca9d" 
                    name="Toplam Net"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📚 Ders Bazlı Performans
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getSubjectPerformance()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageNet" fill="#8884d8" name="Ortalama Net" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Test Dialog */}
      <Dialog open={addTestDialog} onClose={() => setAddTestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni TYT Deneme Sınavı Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Deneme Numarası"
                type="number"
                value={newTest.testNumber}
                onChange={(e) => setNewTest({ ...newTest, testNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Sınav Tarihi"
                type="date"
                value={newTest.testDate}
                onChange={(e) => setNewTest({ ...newTest, testDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {Object.entries(newTest.subjects).map(([subject, data]) => (
              <Grid item xs={12} key={subject}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{subject}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Doğru Sayısı"
                        type="number"
                        value={data.correct}
                        onChange={(e) => setNewTest({
                          ...newTest,
                          subjects: {
                            ...newTest.subjects,
                            [subject]: { ...data, correct: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Yanlış Sayısı"
                        type="number"
                        value={data.wrong}
                        onChange={(e) => setNewTest({
                          ...newTest,
                          subjects: {
                            ...newTest.subjects,
                            [subject]: { ...data, wrong: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Boş Sayısı"
                        type="number"
                        value={data.empty}
                        onChange={(e) => setNewTest({
                          ...newTest,
                          subjects: {
                            ...newTest.subjects,
                            [subject]: { ...data, empty: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Net: {calculateNet(data.correct, data.wrong).toFixed(1)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTestDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            onClick={handleAddTest}
            disabled={!newTest.testNumber}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TYTDashboard;