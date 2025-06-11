import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { LessonTrailMap } from '@/components/learning/lesson-trail-map';
import { PersonalizedRecommendations } from '@/components/learning/personalized-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Map, 
  Brain, 
  Trophy, 
  Clock, 
  Target,
  BookOpen,
  TrendingUp,
  Sparkles,
  Route
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LessonTrail {
  id: number;
  courseId: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  trailData: {
    nodes: any[];
    connections: any[];
    metadata: {
      totalEstimatedTime: number;
      difficultyDistribution: Record<string, number>;
      skillProgression: string[];
    };
  };
  progress?: {
    completedNodes: string[];
    currentNode?: string;
    totalProgress: number;
    timeSpent: number;
  };
}

export default function LearningTrailsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTrail, setSelectedTrail] = useState<LessonTrail | null>(null);
  const [activeTab, setActiveTab] = useState('trails');

  // Fetch user's learning trails
  const { data: trails = [], isLoading: trailsLoading } = useQuery<LessonTrail[]>({
    queryKey: ['/api/learning-trails'],
    enabled: !!user,
  });

  // Fetch personalized recommendations
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/personalized-recommendations'],
    enabled: !!user,
  });

  // Fetch user learning stats
  const { data: userStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/learning-stats'],
    enabled: !!user,
  });

  // Generate new trail mutation
  const generateTrailMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await apiRequest('POST', '/api/learning-trails/generate', { courseId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-trails'] });
      toast({
        title: "New Learning Trail Generated",
        description: "AI has created a personalized learning path for you!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update trail progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ trailId, nodeId, timeSpent }: { trailId: number; nodeId: string; timeSpent: number }) => {
      const response = await apiRequest('POST', '/api/learning-trails/progress', {
        trailId,
        nodeId,
        timeSpent
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-trails'] });
      toast({
        title: "Progress Updated",
        description: "Great work! Keep learning!",
      });
    },
  });

  // Accept recommendation mutation
  const acceptRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: number) => {
      const response = await apiRequest('POST', `/api/personalized-recommendations/${recommendationId}/accept`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/personalized-recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning-trails'] });
    },
  });

  const handleNodeClick = (node: any) => {
    console.log('Node clicked:', node);
    // Navigate to lesson or show lesson modal
  };

  const handleNodeComplete = (nodeId: string) => {
    if (selectedTrail) {
      updateProgressMutation.mutate({
        trailId: selectedTrail.id,
        nodeId,
        timeSpent: 30 // Default time, could be tracked more accurately
      });
    }
  };

  const handleAcceptRecommendation = (recommendation: any) => {
    acceptRecommendationMutation.mutate(recommendation.id);
  };

  const handleDismissRecommendation = (id: number) => {
    // Implementation for dismissing recommendations
    console.log('Dismiss recommendation:', id);
  };

  if (trailsLoading || recommendationsLoading || statsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Interactive Learning Trails</h1>
            <p className="text-muted-foreground">
              AI-powered personalized learning paths with achievement-based progress tracking
            </p>
          </div>
          <Button 
            onClick={() => generateTrailMutation.mutate(1)} // Demo: generate for course 1
            disabled={generateTrailMutation.isPending}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Trail
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trails" className="gap-2">
            <Map className="h-4 w-4" />
            Learning Trails
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Brain className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Learning Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trails" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Trail Selection Sidebar */}
            <div className="space-y-4">
              <h3 className="font-semibold">Available Trails</h3>
              {trails.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium mb-2">No trails yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate your first AI-powered learning trail
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => generateTrailMutation.mutate(1)}
                      disabled={generateTrailMutation.isPending}
                    >
                      Create Trail
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                trails.map((trail) => (
                  <motion.div
                    key={trail.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        selectedTrail?.id === trail.id ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTrail(trail)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{trail.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {trail.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{trail.progress?.totalProgress || 0}%</span>
                          </div>
                          <Progress value={trail.progress?.totalProgress || 0} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {trail.estimatedTime}m
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {trail.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Trail Map */}
            <div className="lg:col-span-3">
              {selectedTrail ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {selectedTrail.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LessonTrailMap
                      nodes={selectedTrail.trailData.nodes}
                      connections={selectedTrail.trailData.connections}
                      userProgress={{
                        completedNodes: selectedTrail.progress?.completedNodes || [],
                        currentNode: selectedTrail.progress?.currentNode,
                        totalProgress: selectedTrail.progress?.totalProgress || 0
                      }}
                      onNodeClick={handleNodeClick}
                      onNodeComplete={handleNodeComplete}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[800px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Select a Learning Trail</h3>
                    <p className="text-muted-foreground">
                      Choose a trail from the sidebar to start your personalized learning journey
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <PersonalizedRecommendations
            recommendations={recommendations}
            userStats={{
              level: userStats.level || 1,
              xp: userStats.totalXp || 0,
              streak: userStats.streak || 0,
              averagePerformance: userStats.averagePerformance || 0.7,
              learningStyle: userStats.learningStyle || 'visual'
            }}
            onAcceptRecommendation={handleAcceptRecommendation}
            onDismissRecommendation={handleDismissRecommendation}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Learning Analytics Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Learning Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trails Completed</span>
                    <span className="font-semibold">{userStats.completedTrails || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Study Time</span>
                    <span className="font-semibold">{Math.round((userStats.totalStudyTime || 0) / 60)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Performance</span>
                    <span className="font-semibold">{Math.round((userStats.averagePerformance || 0) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total XP</span>
                    <span className="font-semibold">{userStats.totalXp || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Level</span>
                    <span className="font-semibold">{userStats.level || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Learning Streak</span>
                    <span className="font-semibold">{userStats.streak || 0} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-semibold text-green-600">+15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Best Subject</span>
                    <span className="font-semibold">{userStats.bestSubject || 'Mathematics'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Focus Area</span>
                    <span className="font-semibold">{userStats.focusArea || 'Problem Solving'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}