// components/AdvancedProgressCharts.js

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const AdvancedProgressCharts = ({ progressData, timeData }) => {
  // progressData: { date: string, net: number, targetNet: number }[]
  // timeData: { date: string, studyTime: number }[]

  return (
    <div className="advanced-charts">
      <h3>İlerleme Analizi</h3>
      
      <div className="chart-row">
        <div className="chart">
          <h4>Net Değişimi</h4>
          <LineChart width={400} height={300} data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="net" stroke="#8884d8" />
            <Line type="monotone" dataKey="targetNet" stroke="#82ca9d" />
          </LineChart>
        </div>
        
        <div className="chart">
          <h4>Çalışma Süresi</h4>
          <BarChart width={400} height={300} data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="studyTime" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProgressCharts;