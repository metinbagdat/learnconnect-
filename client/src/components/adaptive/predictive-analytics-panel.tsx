import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/consolidated-language-context';

interface PredictiveAnalytics {
  successProbability: number;
  timeToCompletion: number;
  strugglingAreas: string[];
  strengthAreas: string[];
  recommendedInterventions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface PredictiveAnalyticsPanelProps {
  analytics: PredictiveAnalytics;
  isLoading?: boolean;
}

export function PredictiveAnalyticsPanel({ analytics, isLoading }: PredictiveAnalyticsPanelProps) {
  const { t } = useLanguage();

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} ${t('minutes')}`;
    if (hours < 24) return `${Math.round(hours)} ${t('hours')}`;
    return `${Math.round(hours / 24)} ${t('days')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('predictiveAnalytics')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Probability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{t('successProbability')}</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              {Math.round(analytics.successProbability * 100)}%
            </span>
          </div>
          <Progress value={analytics.successProbability * 100} className="h-3" />
        </div>

        {/* Time to Completion */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">{t('estimatedTimeToCompletion')}</span>
          </div>
          <span className="font-bold text-blue-800">
            {formatTime(analytics.timeToCompletion)}
          </span>
        </div>

        {/* Risk Level */}
        <Alert className={getRiskLevelColor(analytics.riskLevel)}>
          <div className="flex items-center gap-2">
            {getRiskIcon(analytics.riskLevel)}
            <span className="font-medium">{t('riskLevel')}: {t(analytics.riskLevel)}</span>
          </div>
        </Alert>

        {/* Struggling Areas */}
        {analytics.strugglingAreas.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              {t('strugglingAreas')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {analytics.strugglingAreas.map((area, index) => (
                <Badge key={index} variant="outline" className="border-orange-200 text-orange-800">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Strength Areas */}
        {analytics.strengthAreas.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {t('strengthAreas')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {analytics.strengthAreas.map((area, index) => (
                <Badge key={index} variant="outline" className="border-green-200 text-green-800">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Interventions */}
        {analytics.recommendedInterventions.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">{t('recommendedInterventions')}</h4>
            <ul className="space-y-2">
              {analytics.recommendedInterventions.map((intervention, index) => (
                <li key={index} className="text-sm bg-gray-50 p-2 rounded flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{intervention}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}