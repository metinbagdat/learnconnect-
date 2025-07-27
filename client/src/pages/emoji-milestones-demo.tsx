import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmojiReactionSystem, LearningMilestone } from '@/components/milestones/emoji-reaction-system';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Target, 
  Brain, 
  Rocket, 
  Plus,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock milestones for demonstration
const demoMilestones: LearningMilestone[] = [
  {
    id: 'milestone_1',
    type: 'course_completion',
    title: 'JavaScript Fundamentals Completed!',
    description: 'Successfully completed the Introduction to JavaScript course',
    courseId: 1,
    progress: 100,
    timestamp: new Date().toISOString(),
    metadata: {
      courseName: 'Introduction to JavaScript',
      streakDays: 7
    }
  },
  {
    id: 'milestone_2',
    type: 'lesson_completion',
    title: 'Advanced Functions Mastered',
    description: 'Completed the lesson on advanced JavaScript functions',
    lessonId: 101,
    progress: 100,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      courseName: 'JavaScript Advanced Concepts',
      lessonTitle: 'Advanced Functions and Closures'
    }
  },
  {
    id: 'milestone_3',
    type: 'achievement_unlock',
    title: 'Code Master Badge Earned!',
    description: 'Unlocked the prestigious Code Master achievement',
    achievementId: 5,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      achievementName: 'Code Master',
      courseName: 'Full Stack Development'
    }
  },
  {
    id: 'milestone_4',
    type: 'streak_milestone',
    title: '30-Day Learning Streak!',
    description: 'Maintained a consistent learning streak for 30 days',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      streakDays: 30
    }
  },
  {
    id: 'milestone_5',
    type: 'skill_mastery',
    title: 'React Hooks Mastery',
    description: 'Achieved mastery level in React Hooks',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      skillName: 'React Hooks',
      courseName: 'Advanced React Development'
    }
  },
  {
    id: 'milestone_6',
    type: 'challenge_completion',
    title: 'Algorithm Challenge Conquered',
    description: 'Successfully completed the Binary Search Tree challenge',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      challengeName: 'Binary Search Tree Implementation',
      courseName: 'Data Structures & Algorithms'
    }
  }
];

export default function EmojiMilestonesDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMilestone, setSelectedMilestone] = useState<LearningMilestone | null>(null);
  const [createdReactions, setCreatedReactions] = useState<any[]>([]);

  // Create a new milestone mutation (for demo purposes)
  const createMilestoneMutation = useMutation({
    mutationFn: async (milestoneData: Partial<LearningMilestone>) => {
      const response = await apiRequest('POST', '/api/milestones', {
        ...milestoneData,
        id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/milestones'] });
      toast({
        title: "Milestone Created! 🎉",
        description: "New learning milestone added to your collection",
      });
    },
  });

  // Fetch user's actual milestones
  const { data: userMilestones = [], isLoading } = useQuery<LearningMilestone[]>({
    queryKey: ['/api/milestones'],
    enabled: !!user,
  });

  const handleReactionAdded = (reaction: any) => {
    setCreatedReactions(prev => [reaction, ...prev]);
    toast({
      title: "Reaction Saved! ✨",
      description: "Your milestone celebration has been recorded!",
    });
  };

  const handleCreateDemoMilestone = () => {
    const randomMilestone = demoMilestones[Math.floor(Math.random() * demoMilestones.length)];
    createMilestoneMutation.mutate({
      ...randomMilestone,
      id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    });
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'course_completion':
        return <Trophy className="h-5 w-5 text-gold-600" />;
      case 'lesson_completion':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'achievement_unlock':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'streak_milestone':
        return <Sparkles className="h-5 w-5 text-orange-600" />;
      case 'skill_mastery':
        return <Brain className="h-5 w-5 text-purple-600" />;
      case 'challenge_completion':
        return <Rocket className="h-5 w-5 text-green-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  };

  const allMilestones = [...demoMilestones, ...userMilestones];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-6">Please log in to experience the AI-powered emoji reaction system</p>
            <Button asChild>
              <a href="/auth">Login</a>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Emoji Reactions
          </h1>
        </motion.div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Celebrate your learning milestones with personalized AI-generated emoji reactions! 
          Each achievement gets a unique emotional response tailored to your progress.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>AI-Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-600" />
            <span>Personalized</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-600" />
            <span>Milestone Tracking</span>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Demo Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleCreateDemoMilestone}
              disabled={createMilestoneMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {createMilestoneMutation.isPending ? 'Creating...' : 'Create Random Milestone'}
            </Button>
            
            <Badge variant="outline" className="px-3 py-1">
              Total Milestones: {allMilestones.length}
            </Badge>
            
            <Badge variant="outline" className="px-3 py-1">
              Reactions Created: {createdReactions.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Display */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {getMilestoneIcon(milestone.type)}
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2">
                          {milestone.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {milestone.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize text-xs">
                        {milestone.type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(milestone.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {selectedMilestone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <EmojiReactionSystem
                milestone={selectedMilestone}
                onReactionAdded={handleReactionAdded}
              />
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMilestone(null)}
                >
                  Choose Different Milestone
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Milestone</h3>
              <p className="text-muted-foreground mb-6">
                Click on any milestone from the grid view to see the AI emoji reaction system in action!
              </p>
              <Button onClick={() => setSelectedMilestone(allMilestones[0])}>
                Try First Milestone
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent Reactions */}
      {createdReactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Reactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {createdReactions.map((reaction, index) => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border"
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Milestone Celebrated!</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}