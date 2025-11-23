import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

interface LearningPatterns {
  optimalStudyTimes: string[];
  strongSubjects: string[];
  weakSubjects: string[];
  averageSessionDuration: number;
  consistencyScore: number;
  learningVelocity: number;
  retentionRate: number;
}

interface PerformancePrediction {
  predictedExamScore: number;
  confidence: number;
  requiredDailyStudyHours: number;
  areasNeedingFocus: string[];
  estimatedReadinessDate: string;
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export function AdaptiveInsights() {
  const { data: patterns, isLoading: patternsLoading } = useQuery<LearningPatterns>({
    queryKey: ['/api/adaptive/learning-patterns'],
    staleTime: 5 * 60 * 1000
  });

  const { data: prediction, isLoading: predictionLoading } = useQuery<PerformancePrediction>({
    queryKey: ['/api/adaptive/predict-performance'],
    staleTime: 5 * 60 * 1000
  });

  const isLoading = patternsLoading || predictionLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Performance Prediction */}
      {prediction && (
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exam Performance Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Predicted Score</p>
                <p className="text-3xl font-bold">{Math.round(prediction.predictedExamScore)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{Math.round(prediction.confidence * 100)}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Level</span>
                <span className="font-semibold">{Math.round(prediction.confidence * 100)}%</span>
              </div>
              <Progress value={prediction.confidence * 100} className="h-2" />
            </div>

            <div className="bg-white dark:bg-slate-950 rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Required Daily Study Hours</span>
                <Badge variant="secondary">{prediction.requiredDailyStudyHours}h</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Readiness</span>
                <Badge>{new Date(prediction.estimatedReadinessDate).toLocaleDateString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trend</span>
                <Badge variant={prediction.improvementTrend === 'improving' ? 'default' : 'secondary'}>
                  {prediction.improvementTrend}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Patterns */}
      {patterns && (
        <div className="space-y-4">
          {/* Optimal Study Times */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimal Study Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patterns.optimalStudyTimes.map((time, idx) => (
                  <Badge key={idx} className="text-base py-2 px-3">
                    {time}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Consistency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{Math.round(patterns.consistencyScore)}%</p>
                <Progress value={patterns.consistencyScore} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{Math.round(patterns.retentionRate)}%</p>
                <Progress value={patterns.retentionRate} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{patterns.averageSessionDuration}m</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Learning Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{patterns.learningVelocity.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">topics/day</p>
              </CardContent>
            </Card>
          </div>

          {/* Strong & Weak Subjects */}
          <div className="grid grid-cols-2 gap-4">
            {/* Strong Subjects */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  Strong Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {patterns.strongSubjects.map((subject, idx) => (
                    <li key={idx} className="text-sm">✓ {subject}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weak Subjects */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  Needs Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {patterns.weakSubjects.map((subject, idx) => (
                    <li key={idx} className="text-sm">• {subject}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
