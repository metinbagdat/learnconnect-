import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Brain, TrendingUp, Target, Settings, Eye, Lightbulb } from 'lucide-react';

// Import the new adaptive components
import { LearningStyleDetector } from '@/components/adaptive/learning-style-detector';
import { DifficultyAdjuster } from '@/components/adaptive/difficulty-adjuster';
import { PredictiveAnalyticsPanel } from '@/components/adaptive/predictive-analytics-panel';
import { AdaptiveInsightsDashboard } from '@/components/adaptive/adaptive-insights-dashboard';

export default function AdvancedAdaptiveLearning() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('learning-style');

  // Mock interaction data for demo purposes
  const mockInteractionData = {
    sessionDuration: 45,
    clicksOnVisualElements: 15,
    audioContentEngagement: 5,
    handsOnActivityTime: 20,
    readingTime: 25,
    preferredContentTypes: ['diagrams', 'interactive-demos', 'visual-explanations'],
    completionPatterns: {
      visualTasks: 0.85,
      auditoryTasks: 0.65,
      kinestheticTasks: 0.90,
      readingTasks: 0.70
    }
  };

  const mockPerformanceData = {
    recentScores: [85, 78, 92, 88, 76, 94],
    timeSpentPerTopic: { functions: 120, algebra: 90, geometry: 150 },
    strugglingConcepts: ['complex equations', 'advanced trigonometry'],
    masteredConcepts: ['basic algebra', 'linear functions'],
    currentDifficultyLevel: 0.7,
    adaptationHistory: [
      { timestamp: '2025-01-20', difficulty: 0.6, performance: 0.82 },
      { timestamp: '2025-01-25', difficulty: 0.7, performance: 0.78 }
    ]
  };

  const mockLearningHistory = {
    totalStudyTime: 120,
    coursesCompleted: 3,
    averageScore: 0.82,
    learningStreak: 15,
    topicProgression: {
      mathematics: { progress: 0.85, timeSpent: 80 },
      physics: { progress: 0.65, timeSpent: 40 }
    },
    challengePatterns: {
      morningPerformance: 0.88,
      afternoonPerformance: 0.75,
      preferredSessionLength: 45
    }
  };

  const mockComprehensiveData = {
    userProfile: mockInteractionData,
    performance: mockPerformanceData,
    history: mockLearningHistory,
    contextualFactors: {
      deviceType: 'desktop',
      studyEnvironment: 'quiet',
      timeOfDay: 'morning',
      socialLearningPreference: 'individual'
    }
  };

  // API mutations for adaptive learning features
  const learningStyleMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/adaptive/learning-style/${user?.id}`, {
        interactionData: mockInteractionData,
        language
      });
      return response.json();
    }
  });

  const difficultyAdjustmentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/adaptive/difficulty-adjustment/${user?.id}`, {
        performanceData: mockPerformanceData,
        language
      });
      return response.json();
    }
  });

  const predictiveAnalyticsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/adaptive/predictive-analytics/${user?.id}`, {
        learningHistory: mockLearningHistory,
        language
      });
      return response.json();
    }
  });

  const adaptiveInsightsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/adaptive/insights/${user?.id}`, {
        comprehensiveData: mockComprehensiveData,
        language
      });
      return response.json();
    }
  });

  // Auto-generate data when component mounts or tab changes
  useEffect(() => {
    if (!user) return;

    switch (activeTab) {
      case 'learning-style':
        if (!learningStyleMutation.data && !learningStyleMutation.isPending) {
          learningStyleMutation.mutate();
        }
        break;
      case 'difficulty':
        if (!difficultyAdjustmentMutation.data && !difficultyAdjustmentMutation.isPending) {
          difficultyAdjustmentMutation.mutate();
        }
        break;
      case 'analytics':
        if (!predictiveAnalyticsMutation.data && !predictiveAnalyticsMutation.isPending) {
          predictiveAnalyticsMutation.mutate();
        }
        break;
      case 'insights':
        if (!adaptiveInsightsMutation.data && !adaptiveInsightsMutation.isPending) {
          adaptiveInsightsMutation.mutate();
        }
        break;
    }
  }, [activeTab, user]);

  const handleDifficultyAdjustment = (newDifficulty: number) => {
    console.log('Applying new difficulty:', newDifficulty);
    // In a real app, this would update the user's learning profile
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('authenticationRequired')}</h3>
            <p className="text-gray-500 mb-6">{t('pleaseLoginToViewAdaptivePaths')}</p>
            <Button asChild>
              <a href="/auth">{t('login')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Advanced Adaptive Learning</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Experience next-generation AI-powered adaptive learning with real-time learning style detection, 
          dynamic difficulty adjustment, predictive analytics, and personalized insights.
        </p>
        
        {/* Status Indicators */}
        <div className="flex justify-center gap-4 mt-6">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Eye className="h-3 w-3 mr-1" />
            Style Detection: Active
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Settings className="h-3 w-3 mr-1" />
            Auto-Adjustment: Enabled
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Predictive Mode: On
          </Badge>
        </div>
      </div>

      {/* Advanced Adaptive Learning Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Adaptive Learning Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="learning-style" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('learningStyleDetection')}
              </TabsTrigger>
              <TabsTrigger value="difficulty" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('difficultyAdjustment')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('predictiveAnalytics')}
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('adaptiveInsights')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learning-style" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Learning Style Analysis</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => learningStyleMutation.mutate()}
                    disabled={learningStyleMutation.isPending}
                  >
                    {learningStyleMutation.isPending ? 'Analyzing...' : 'Refresh Analysis'}
                  </Button>
                </div>
                <LearningStyleDetector 
                  profile={learningStyleMutation.data || {
                    visual: 0.25,
                    auditory: 0.25,
                    kinesthetic: 0.25,
                    readingWriting: 0.25,
                    dominant: 'visual',
                    confidence: 0.5
                  }}
                  isLoading={learningStyleMutation.isPending}
                />
              </div>
            </TabsContent>

            <TabsContent value="difficulty" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Dynamic Difficulty Adjustment</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => difficultyAdjustmentMutation.mutate()}
                    disabled={difficultyAdjustmentMutation.isPending}
                  >
                    {difficultyAdjustmentMutation.isPending ? 'Calculating...' : 'Recalculate'}
                  </Button>
                </div>
                <DifficultyAdjuster 
                  adjustment={difficultyAdjustmentMutation.data || {
                    currentDifficulty: 0.5,
                    recommendedDifficulty: 0.5,
                    adjustmentReason: 'No data available',
                    confidenceLevel: 0.3,
                    nextStepSuggestions: ['Continue with current settings']
                  }}
                  onApplyAdjustment={handleDifficultyAdjustment}
                  isLoading={difficultyAdjustmentMutation.isPending}
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Predictive Learning Analytics</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => predictiveAnalyticsMutation.mutate()}
                    disabled={predictiveAnalyticsMutation.isPending}
                  >
                    {predictiveAnalyticsMutation.isPending ? 'Predicting...' : 'Update Predictions'}
                  </Button>
                </div>
                <PredictiveAnalyticsPanel 
                  analytics={predictiveAnalyticsMutation.data || {
                    successProbability: 0.75,
                    timeToCompletion: 40,
                    strugglingAreas: ['Loading...'],
                    strengthAreas: ['Loading...'],
                    recommendedInterventions: ['Analyzing data...'],
                    riskLevel: 'medium'
                  }}
                  isLoading={predictiveAnalyticsMutation.isPending}
                />
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Personalized Learning Insights</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => adaptiveInsightsMutation.mutate()}
                    disabled={adaptiveInsightsMutation.isPending}
                  >
                    {adaptiveInsightsMutation.isPending ? 'Generating...' : 'Generate New Insights'}
                  </Button>
                </div>
                <AdaptiveInsightsDashboard 
                  insights={adaptiveInsightsMutation.data || []}
                  isLoading={adaptiveInsightsMutation.isPending}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-800">Advanced Adaptive Learning Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">AI-Powered Intelligence:</h4>
              <ul className="space-y-1 text-sm text-purple-600">
                <li>• Real-time learning style detection and adaptation</li>
                <li>• Dynamic difficulty adjustment based on performance</li>
                <li>• Predictive analytics for learning outcomes</li>
                <li>• Personalized insights and recommendations</li>
                <li>• Contextual learning environment optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">Adaptive Capabilities:</h4>
              <ul className="space-y-1 text-sm text-blue-600">
                <li>• Multi-modal learning style analysis</li>
                <li>• Continuous performance monitoring</li>
                <li>• Risk assessment and early intervention</li>
                <li>• Success probability calculations</li>
                <li>• Personalized learning path optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}