import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/hooks/use-auth';
import { AdaptivePathVisualization } from '@/components/learning/adaptive-path-visualization';
import { Brain, BookOpen, Target, TrendingUp, Star } from 'lucide-react';

export default function AdaptiveLearningDemo() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedPathId, setSelectedPathId] = useState<number>(1);

  // Mock learning paths for demo
  const demoPaths = [
    {
      id: 1,
      title: 'Advanced Mathematics for AYT',
      description: 'Comprehensive mathematics preparation for Turkish university entrance exams',
      difficulty: 'advanced',
      estimatedDuration: 120,
      totalSteps: 8
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      description: 'Core physics concepts and problem-solving techniques',
      difficulty: 'intermediate',
      estimatedDuration: 90,
      totalSteps: 6
    },
    {
      id: 3,
      title: 'Chemistry Essentials',
      description: 'Essential chemistry topics for exam preparation',
      difficulty: 'beginner',
      estimatedDuration: 75,
      totalSteps: 5
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">{t('adaptiveLearningPathVisualization')}</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('adaptiveLearningDescription')}
        </p>
        
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm">{t('aiPoweredRecommendations')}</h4>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm">{t('personalizedLearningPaths')}</h4>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm">{t('progressTracking')}</h4>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm">{t('adaptiveInsights')}</h4>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Path Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('selectLearningPath')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoPaths.map((path) => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPathId === path.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedPathId(path.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{path.title}</h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <span className="text-gray-500">{path.estimatedDuration}h</span>
                      <span className="text-gray-500">{path.totalSteps} {t('steps')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Learning Path Visualization */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {t('adaptivePathVisualization')}
          </h2>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {t('pathId')}: {selectedPathId}
          </Badge>
        </div>
        
        <AdaptivePathVisualization 
          pathId={selectedPathId}
          compact={false}
        />
      </div>

      {/* Information Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-800">{t('howItWorks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">{t('adaptiveFeatures')}:</h4>
              <ul className="space-y-1 text-sm text-blue-600">
                <li>• {t('personalizedContentRecommendations')}</li>
                <li>• {t('dynamicDifficultyAdjustment')}</li>
                <li>• {t('learningStyleDetection')}</li>
                <li>• {t('prerequisiteTracking')}</li>
                <li>• {t('successProbabilityCalculation')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">{t('analyticsFeatures')}:</h4>
              <ul className="space-y-1 text-sm text-purple-600">
                <li>• {t('timeSpentTracking')}</li>
                <li>• {t('performanceAnalytics')}</li>
                <li>• {t('learningVelocityMeasurement')}</li>
                <li>• {t('skillGapIdentification')}</li>
                <li>• {t('improvementRecommendations')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}