// components/ProgressCharts.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export function ProgressCharts({ progress }) {
  const lineData = progress.map(day => ({
    date: day.date,
    studyTime: day.totalStudyTime,
    completed: day.completedTasks?.length || 0
  }));

  const subjectData = calculateSubjectDistribution(progress);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="progress-charts">
      <h3>Study Progress</h3>
      
      <div className="chart-container">
        <LineChart width={400} height={200} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="studyTime" stroke="#8884d8" />
          <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
        </LineChart>
        
        <PieChart width={400} height={200}>
          <Pie
            data={subjectData}
            cx={200}
            cy={100}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {subjectData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}