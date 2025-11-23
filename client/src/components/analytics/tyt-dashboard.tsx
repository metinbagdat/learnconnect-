import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, Target, AlertCircle } from 'lucide-react';

interface SubjectScore {
  subject: string;
  net: number;
  targetNet: number;
  correct: number;
  wrong: number;
  empty: number;
}

interface TYTDashboardProps {
  overallScore?: number;
  targetScore?: number;
  subjectScores: SubjectScore[];
  weakTopics?: string[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SUBJECT_TRANSLATIONS: Record<string, string> = {
  'turkish': 'Türkçe',
  'mathematics': 'Matematik',
  'science': 'Fen Bilimleri',
  'social_sciences': 'Sosyal Bilimler',
  'turkish_literature': 'Türk Edebiyatı'
};

export function TYTDashboard({
  overallScore = 0,
  targetScore = 400,
  subjectScores = [],
  weakTopics = [],
  isLoading = false
}: TYTDashboardProps) {
  
  const chartData = useMemo(() => subjectScores.map(s => ({
    subject: SUBJECT_TRANSLATIONS[s.subject] || s.subject,
    net: s.net,
    targetNet: s.targetNet,
    correct: s.correct,
    wrong: s.wrong,
    empty: s.empty
  })), [subjectScores]);

  const scoreProgress = useMemo(() => Math.min(100, (overallScore / targetScore) * 100), [overallScore, targetScore]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Overall Score Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            TYT Hazırlık Paneli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Mevcut Puan</p>
              <p className="text-3xl font-bold text-primary">{overallScore}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Hedef Puan</p>
              <p className="text-3xl font-bold text-muted-foreground">{targetScore}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Target</span>
              <span className="font-semibold">{Math.round(scoreProgress)}%</span>
            </div>
            <Progress value={scoreProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Net Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Net Hedef Karşılaştırması</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <Legend />
              <Bar dataKey="net" fill="#8884d8" name="Mevcut Net" />
              <Bar dataKey="targetNet" fill="#82ca9d" name="Hedef Net" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Konu Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, net }) => `${subject}: ${net}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="net"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Details */}
      <Card>
        <CardHeader>
          <CardTitle>Konu Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((subject, index) => (
              <div key={index} className="space-y-2 pb-4 border-b last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.subject}</span>
                  <Badge variant="outline">{subject.net} Net</Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>✓ {subject.correct} Doğru</span>
                  <span>✗ {subject.wrong} Yanlış</span>
                  <span>- {subject.empty} Boş</span>
                </div>
                <Progress value={(subject.net / subject.targetNet) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-5 w-5" />
              Zayıf Olduğun Konular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weakTopics.map((topic, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
