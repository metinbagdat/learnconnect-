import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface AdaptiveInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'risk';
  title: string;
  description: string;
  actionable: boolean;
  priority: number;
  recommendations: string[];
}

interface AdaptiveInsightsDashboardProps {
  insights: AdaptiveInsight[];
  isLoading?: boolean;
}

export function AdaptiveInsightsDashboard({ insights, isLoading }: AdaptiveInsightsDashboardProps) {
  const { t } = useLanguage();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'weakness': return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'opportunity': return <Target className="h-5 w-5 text-blue-600" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'border-l-green-500 bg-green-50';
      case 'weakness': return 'border-l-red-500 bg-red-50';
      case 'opportunity': return 'border-l-blue-500 bg-blue-50';
      case 'risk': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (priority >= 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (priority >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return t('high');
    if (priority >= 3) return t('medium');
    if (priority >= 2) return t('normal');
    return t('low');
  };

  const sortedInsights = [...insights].sort((a, b) => b.priority - a.priority);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-l-4 border-l-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
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
          <Lightbulb className="h-5 w-5" />
          {t('adaptiveInsights')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedInsights.map((insight, index) => (
            <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <div>
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <span className="text-xs text-gray-500 capitalize">{t(insight.type)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          {t('actionable')}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getPriorityBadgeColor(insight.priority)}`}>
                        {getPriorityLabel(insight.priority)}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700">{insight.description}</p>

                  {/* Recommendations */}
                  {insight.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-1">{t('recommendations')}:</h5>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">{t('noInsightsAvailable')}</p>
              <p className="text-xs text-gray-400">{t('insightsWillAppearAsYouProgress')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}