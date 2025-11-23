import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const TYT_SUBJECTS = {
  turkish: { name: 'Türkçe', color: '#8884d8', totalQuestions: 40 },
  mathematics: { name: 'Matematik', color: '#82ca9d', totalQuestions: 40 },
  science: { name: 'Fen Bilimleri', color: '#ffc658', totalQuestions: 20 },
  social_sciences: { name: 'Sosyal Bilimler', color: '#ff8042', totalQuestions: 20 }
};

export default function EnhancedTYTDashboard() {
  const { data: testHistory = [], isLoading } = useQuery({
    queryKey: ['/api/practice-tests/tyt'],
  });

  const processedData = useMemo(() => {
    if (!testHistory.length) return [];
    
    return testHistory.map((test: any) => ({
      date: new Date(test.createdAt).toLocaleDateString(),
      ...Object.entries(TYT_SUBJECTS).reduce((acc, [key, subject]) => {
        const subjectScore = test.subjects?.[key];
        return {
          ...acc,
          [subject.name]: subjectScore?.net || 0
        };
      }, {})
    }));
  }, [testHistory]);

  const subjectStats = useMemo(() => {
    if (!testHistory.length) return [];

    return Object.entries(TYT_SUBJECTS).map(([key, subject]) => {
      const scores = testHistory.map((t: any) => t.subjects?.[key]?.net || 0);
      const average = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
      const max = Math.max(...scores, 0);
      const current = scores[0] || 0;

      return {
        subject: subject.name,
        current,
        average,
        max,
        color: subject.color,
        total: subject.totalQuestions
      };
    });
  }, [testHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">📊 TYT Takip Paneli</h1>
        <p className="text-slate-600 dark:text-slate-400">Sınavdan 100 puan uzağınız</p>
      </div>

      {/* Subject Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjectStats.map((stat) => (
          <Card key={stat.subject} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm">{stat.subject}</h3>
              <Badge style={{ backgroundColor: stat.color }} className="text-white">
                {stat.current}/{stat.total}
              </Badge>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Ortalama:</span>
                <span className="font-medium">{stat.average.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>En yüksek:</span>
                <span className="font-medium">{stat.max}</span>
              </div>
            </div>
            <div className="mt-3 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${(stat.current / stat.total) * 100}%`, backgroundColor: stat.color }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      {processedData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold mb-4">Gelişim Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.values(TYT_SUBJECTS).map((subject) => (
                <Line
                  key={subject.name}
                  type="monotone"
                  dataKey={subject.name}
                  stroke={subject.color}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Subject Performance Comparison */}
      {subjectStats.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold mb-4">Ders Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" name="Mevcut Net" fill="#8884d8" />
              <Bar dataKey="average" name="Ortalama Net" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950">
          <p className="text-sm text-slate-600 dark:text-slate-400">Toplam Deneme</p>
          <p className="text-2xl font-bold">{testHistory.length}</p>
        </Card>
        <Card className="p-4 bg-green-50 dark:bg-green-950">
          <p className="text-sm text-slate-600 dark:text-slate-400">Ortalama Puan</p>
          <p className="text-2xl font-bold">
            {(testHistory.reduce((sum: number, t: any) => sum + (t.calculatedScores?.overall?.overallScore || 0), 0) / Math.max(testHistory.length, 1)).toFixed(0)}
          </p>
        </Card>
        <Card className="p-4 bg-purple-50 dark:bg-purple-950">
          <p className="text-sm text-slate-600 dark:text-slate-400">En Yüksek Puan</p>
          <p className="text-2xl font-bold">
            {Math.max(...testHistory.map((t: any) => t.calculatedScores?.overall?.overallScore || 0), 0)}
          </p>
        </Card>
      </div>
    </div>
  );
}
