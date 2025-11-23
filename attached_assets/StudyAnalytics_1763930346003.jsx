// src/components/TimeTracking/StudyAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const StudyAnalytics = () => {
  const [sessions, setSessions] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadSessions();
  }, [timeRange]);

  const loadSessions = () => {
    const startDate = getStartDate(timeRange);
    const q = query(
      collection(db, 'timeSessions'),
      where('userId', '==', 'currentUserId'),
      where('startTime', '>=', startDate),
      orderBy('startTime', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      calculateAnalytics(sessionsData);
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

  const calculateAnalytics = (sessionsData) => {
    const analyticsData = {
      totalTime: sessionsData.reduce((total, session) => total + session.duration, 0),
      averageSession: sessionsData.length > 0 ? 
        sessionsData.reduce((total, session) => total + session.duration, 0) / sessionsData.length : 0,
      subjectDistribution: calculateSubjectDistribution(sessionsData),
      dailyProgress: calculateDailyProgress(sessionsData),
      efficiencyTrend: calculateEfficiencyTrend(sessionsData),
      bestStudyTimes: calculateBestStudyTimes(sessionsData)
    };
    setAnalytics(analyticsData);
  };

  const calculateSubjectDistribution = (sessions) => {
    const distribution = {};
    sessions.forEach(session => {
      distribution[session.subject] = (distribution[session.subject] || 0) + session.duration;
    });
    return Object.entries(distribution).map(([subject, time]) => ({
      subject,
      time,
      percentage: (time / analytics.totalTime) * 100
    }));
  };

  const calculateDailyProgress = (sessions) => {
    const dailyData = {};
    sessions.forEach(session => {
      const date = session.date;
      dailyData[date] = (dailyData[date] || 0) + session.duration;
    });
    return Object.entries(dailyData).map(([date, time]) => ({ date, time }));
  };

  const calculateEfficiencyTrend = (sessions) => {
    const dailyEfficiency = {};
    sessions.forEach(session => {
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
    }));
  };

  const calculateBestStudyTimes = (sessions) => {
    const timeSlots = {
      '06-09': 0, '09-12': 0, '12-15': 0, '15-18': 0, '18-21': 0, '21-24': 0
    };
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime?.toDate()).getHours();
      let slot;
      if (hour >= 6 && hour < 9) slot = '06-09';
      else if (hour >= 9 && hour < 12) slot = '09-12';
      else if (hour >= 12 && hour < 15) slot = '12-15';
      else if (hour >= 15 && hour < 18) slot = '15-18';
      else if (hour >= 18 && hour < 21) slot = '18-21';
      else slot = '21-24';
      
      timeSlots[slot] += session.duration;
    });
    
    return Object.entries(timeSlots).map(([time, duration]) => ({ time, duration }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          📈 Çalışma Analitikleri
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Periyot</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Periyot"
          >
            <MenuItem value="week">Son 1 Hafta</MenuItem>
            <MenuItem value="month">Son 1 Ay</MenuItem>
            <MenuItem value="quarter">Son 3 Ay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Çalışma
              </Typography>
              <Typography variant="h4">
                {Math.round(analytics.totalTime / 60)}h
              </Typography>
              <Typography variant="body2">
                {sessions.length} oturum
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ortalama Oturum
              </Typography>
              <Typography variant="h4">
                {Math.round(analytics.averageSession)}m
              </Typography>
              <Typography variant="body2">
                Süre
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Verimli Ders
              </Typography>
              <Typography variant="h4">
                {analytics.subjectDistribution?.[0]?.subject || '-'}
              </Typography>
              <Typography variant="body2">
                {analytics.subjectDistribution?.[0]?.percentage?.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En İyi Zaman
              </Typography>
              <Typography variant="h4">
                {analytics.bestStudyTimes?.[0]?.time || '-'}
              </Typography>
              <Typography variant="body2">
                {analytics.bestStudyTimes?.[0]?.duration || 0}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ders Dağılımı
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.subjectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ subject, percentage }) => `${subject}: ${percentage?.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="time"
                  >
                    {analytics.subjectDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Günlük Çalışma Süresi
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#8884d8" name="Dakika" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Efficiency Trend */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Verimlilik Trendi
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.efficiencyTrend}>
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
      </Grid>
    </Box>
  );
};

export default StudyAnalytics;