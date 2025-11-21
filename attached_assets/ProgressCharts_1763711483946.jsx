// src/components/Analytics/ProgressCharts.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ProgressCharts = () => {
  const [progressData, setProgressData] = useState([]);
  const [timeSessions, setTimeSessions] = useState([]);
  const [exams, setExams] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    loadProgressData();
    loadTimeSessions();
    loadExams();
  }, [timeRange]);

  const loadProgressData = () => {
    const startDate = getStartDate(timeRange);
    const q = query(
      collection(db, 'studentProgress'),
      where('userId', '==', 'currentUserId'),
      where('date', '>=', startDate),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProgressData(data);
    });
  };

  const loadTimeSessions = () => {
    const startDate = getStartDate(timeRange);
    const q = query(
      collection(db, 'timeSessions'),
      where('userId', '==', 'currentUserId'),
      where('startTime', '>=', startDate),
      orderBy('startTime', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimeSessions(data);
    });
  };

  const loadExams = () => {
    const q = query(
      collection(db, 'exams'),
      where('userId', '==', 'currentUserId')
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExams(data);
    });
  };

  const getStartDate = (range) => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  const getStudyTimeData = () => {
    const dailyData = {};
    
    timeSessions.forEach(session => {
      const date = session.date;
      if (!dailyData[date]) {
        dailyData[date] = { date, studyTime: 0, sessions: 0 };
      }
      dailyData[date].studyTime += session.duration;
      dailyData[date].sessions += 1;
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getSubjectDistribution = () => {
    const distribution = {};
    
    timeSessions.forEach(session => {
      distribution[session.subject] = (distribution[session.subject] || 0) + session.duration;
    });

    return Object.entries(distribution).map(([subject, time]) => ({
      subject,
      time: Math.round(time / 60) // Convert to hours
    }));
  };

  const getEfficiencyTrend = () => {
    const dailyEfficiency = {};
    
    timeSessions.forEach(session => {
      const date = session.date;
      if (!dailyEfficiency[date]) {
        dailyEfficiency[date] = { total: 0, count: 0 };
      }
      dailyEfficiency[date].total += session.efficiency;
      dailyEfficiency[date].count += 1;
    });

    return Object.entries(dailyEfficiency).map(([date, data]) => ({
      date,
      efficiency: Math.round(data.total / data.count)
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getExamPerformance = () => {
    return exams.filter(exam => exam.completed).map(exam => ({
      name: exam.name,
      score: exam.score || 0,
      fullMark: 100
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        📊 Detaylı İlerleme Analizleri
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Zaman Aralığı</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Zaman Aralığı"
                >
                  <MenuItem value="week">Son 1 Hafta</MenuItem>
                  <MenuItem value="month">Son 1 Ay</MenuItem>
                  <MenuItem value="quarter">Son 3 Ay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Grafik Türü</InputLabel>
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  label="Grafik Türü"
                >
                  <MenuItem value="line">Çizgi Grafik</MenuItem>
                  <MenuItem value="bar">Çubuk Grafik</MenuItem>
                  <MenuItem value="area">Alan Grafik</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Study Time Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Günlük Çalışma Süresi
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'line' ? (
                  <LineChart data={getStudyTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Dakika', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="studyTime" 
                      stroke="#8884d8" 
                      name="Çalışma Süresi (dk)"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={getStudyTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="studyTime" fill="#8884d8" name="Çalışma Süresi (dk)" />
                  </BarChart>
                ) : (
                  <AreaChart data={getStudyTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="studyTime" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Çalışma Süresi (dk)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📚 Ders Dağılımı
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getSubjectDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ subject, time }) => `${subject}: ${time}h`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="time"
                  >
                    {getSubjectDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Efficiency Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ Verimlilik Trendi
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={getEfficiencyTrend()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#82ca9d" 
                    name="Verimlilik (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Exam Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Sınav Performansı
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getExamPerformance()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#ffc658" name="Sınav Puanı" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Çalışma İstatistikleri
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Math.round(timeSessions.reduce((total, session) => total + session.duration, 0) / 60)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Toplam Saat
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {timeSessions.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Oturum Sayısı
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {timeSessions.length > 0 
                        ? Math.round(timeSessions.reduce((total, session) => total + session.duration, 0) / timeSessions.length)
                        : 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ort. Oturum (dk)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {timeSessions.length > 0 
                        ? Math.round(timeSessions.reduce((total, session) => total + session.efficiency, 0) / timeSessions.length)
                        : 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ort. Verimlilik
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressCharts;