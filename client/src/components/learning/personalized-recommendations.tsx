import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonalizedRecommendation {
  id: number;
  type: 'lesson' | 'course' | 'trail' | 'skill_gap';
  resourceId: number;
  title: string;
  aiReasoning: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  metadata: {
    difficultyAdjustment: 'easier' | 'harder' | 'maintain';
    focusAreas: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  };
}

interface PersonalizedRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
  userStats: {
    level: number;
    xp: number;
    streak: number;
    averagePerformance: number;
    learningStyle: string;
  };
  onAcceptRecommendation: (recommendation: PersonalizedRecommendation) => void;
  onDismissRecommendation: (id: number) => void;
}

export function PersonalizedRecommendations({
  recommendations,
  userStats,
  onAcceptRecommendation,
  onDismissRecommendation
}: PersonalizedRecommendationsProps) {
  
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'course': return Trophy;
      case 'trail': return Target;
      case 'skill_gap': return TrendingUp;
      default: return Brain;
    }
  }

  function getConfidenceColor(confidence: number) {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(userStats.averagePerformance * 100)}%</div>
              <div className="text-sm text-muted-foreground">Avg Performance</div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {userStats.learningStyle} Learner
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Personalized for You
        </h3>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-muted-foreground mb-2">
                Learning from your progress...
              </h4>
              <p className="text-sm text-muted-foreground">
                Complete more lessons to receive personalized recommendations
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((recommendation, index) => {
              const TypeIcon = getTypeIcon(recommendation.type);
              
              return (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-blue-100 rounded-full p-2">
                            <TypeIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{recommendation.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={getPriorityColor(recommendation.priority)}
                              >
                                {recommendation.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {recommendation.aiReasoning}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Recommendation Details */}
                      <div className="space-y-3 mb-4">
                        {/* Focus Areas */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-1">
                            Focus Areas
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.metadata.focusAreas.map((area, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recommendation.estimatedTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {recommendation.metadata.learningStyle} style
                          </span>
                          <span className={`flex items-center gap-1 ${getConfidenceColor(recommendation.confidence)}`}>
                            <TrendingUp className="h-3 w-3" />
                            {Math.round(recommendation.confidence * 100)}% match
                          </span>
                        </div>

                        {/* Difficulty Adjustment */}
                        {recommendation.metadata.difficultyAdjustment !== 'maintain' && (
                          <div className="flex items-center gap-2 text-xs">
                            <Lightbulb className="h-3 w-3 text-yellow-500" />
                            <span className="text-muted-foreground">
                              Difficulty adjusted {recommendation.metadata.difficultyAdjustment} based on your performance
                            </span>
                          </div>
                        )}

                        {/* Confidence Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">AI Confidence</span>
                            <span className={getConfidenceColor(recommendation.confidence)}>
                              {Math.round(recommendation.confidence * 100)}%
                            </span>
                          </div>
                          <Progress value={recommendation.confidence * 100} className="h-2" />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => onAcceptRecommendation(recommendation)}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Start Learning
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onDismissRecommendation(recommendation.id)}
                        >
                          Maybe Later
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Learning Style Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Your Learning Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Learning Style</span>
              <Badge variant="outline">{userStats.learningStyle}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Consistency</span>
              <div className="flex items-center gap-2">
                <Progress value={(userStats.streak / 30) * 100} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">{userStats.streak}/30 days</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Performance Trend</span>
              <div className={`flex items-center gap-1 ${
                userStats.averagePerformance >= 0.8 ? 'text-green-600' :
                userStats.averagePerformance >= 0.6 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {userStats.averagePerformance >= 0.8 ? 'Excellent' :
                 userStats.averagePerformance >= 0.6 ? 'Good' : 'Improving'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}