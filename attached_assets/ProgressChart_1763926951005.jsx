// src/components/Charts/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const ProgressChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, 'AIEngine/PerformanceLogs'),
      where('student_id', '==', user.uid),
      where('timestamp', '>=', sevenDaysAgo),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data());
      
      // Group by date and calculate average score per day
      const dailyData = logs.reduce((acc, log) => {
        const date = log.timestamp.toDate().toLocaleDateString('tr-TR');
        if (!acc[date]) {
          acc[date] = { date, totalScore: 0, count: 0 };
        }
        acc[date].totalScore += log.performance.score;
        acc[date].count += 1;
        return acc;
      }, {});

      const chartData = Object.values(dailyData).map(day => ({
        date: day.date,
        score: Math.round(day.totalScore / day.count)
      }));

      setChartData(chartData);
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="progress-chart">
      <h3>7 Günlük Performans</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} name="Puan" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;