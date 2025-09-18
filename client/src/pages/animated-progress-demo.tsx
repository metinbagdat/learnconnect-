import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedProgressBubbles, ProgressBubbleData } from '@/components/progress/animated-progress-bubbles';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { BilingualText } from '@/components/ui/bilingual-text';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Target, 
  Brain, 
  Rocket, 
  Plus,
  Shuffle,
  Play,
  User,
  BookOpen,
  TrendingUp,
  Zap,
  Clock,
  Award,
  ArrowLeft,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

// Demo data for animated progress bubbles
const generateDemoProgressData = (): ProgressBubbleData[] => [
  {
    id: 'course_js_basics',
    title: 'JavaScript Fundamentals',
    category: 'course',
    progress: 85,
    maxValue: 20,
    currentValue: 17,
    color: 'blue',
    icon: 'BookOpen',
    description: 'Master the fundamentals of JavaScript programming',
    isActive: true,
    animationSpeed: 1.2,
    metadata: {
      difficulty: 'Beginner',
      timeSpent: 120,
      lastUpdate: new Date().toISOString(),
      priority: 'high'
    }
  },
  {
    id: 'skill_react_hooks',
    title: 'React Hooks Mastery',
    category: 'skill',
    progress: 92,
    maxValue: 15,
    currentValue: 14,
    color: 'purple',
    icon: 'Target',
    description: 'Advanced React Hooks patterns and best practices',
    isActive: true,
    animationSpeed: 0.8,
    metadata: {
      difficulty: 'Advanced',
      timeSpent: 85,
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium'
    }
  },
  {
    id: 'achievement_first_project',
    title: 'First Project Complete',
    category: 'achievement',
    progress: 100,
    maxValue: 1,
    currentValue: 1,
    color: 'gold',
    icon: 'Trophy',
    description: 'Successfully completed your first coding project',
    isActive: false,
    animationSpeed: 1.5,
    metadata: {
      priority: 'high'
    }
  },
  {
    id: 'streak_daily_learning',
    title: '30-Day Learning Streak',
    category: 'streak',
    progress: 73,
    maxValue: 30,
    currentValue: 22,
    color: 'orange',
    icon: 'Zap',
    description: 'Consistent daily learning progress',
    isActive: true,
    animationSpeed: 2.0,
    metadata: {
      priority: 'high',
      timeSpent: 660,
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'level_student_progress',
    title: 'Student Level 3',
    category: 'level',
    progress: 45,
    maxValue: 1000,
    currentValue: 450,
    color: 'pink',
    icon: 'Star',
    description: 'Experience points towards next level',
    isActive: true,
    animationSpeed: 0.6,
    metadata: {
      priority: 'medium',
      lastUpdate: new Date().toISOString()
    }
  },
  {
    id: 'course_advanced_css',
    title: 'Advanced CSS Techniques',
    category: 'course',
    progress: 60,
    maxValue: 18,
    currentValue: 11,
    color: 'blue',
    icon: 'BookOpen',
    description: 'Master advanced CSS layouts and animations',
    isActive: false,
    animationSpeed: 1.0,
    metadata: {
      difficulty: 'Intermediate',
      timeSpent: 75,
      priority: 'medium'
    }
  },
  {
    id: 'skill_typescript',
    title: 'TypeScript Proficiency',
    category: 'skill',
    progress: 38,
    maxValue: 25,
    currentValue: 9,
    color: 'purple',
    icon: 'Target',
    description: 'Strong typing and advanced TypeScript features',
    isActive: false,
    animationSpeed: 1.3,
    metadata: {
      difficulty: 'Intermediate',
      timeSpent: 45,
      priority: 'low'
    }
  },
  {
    id: 'achievement_code_reviewer',
    title: 'Code Reviewer Badge',
    category: 'achievement',
    progress: 100,
    maxValue: 1,
    currentValue: 1,
    color: 'gold',
    icon: 'Award',
    description: 'Earned for helping peers with code reviews',
    isActive: false,
    animationSpeed: 1.0,
    metadata: {
      priority: 'medium'
    }
  },
  {
    id: 'course_data_structures',
    title: 'Data Structures & Algorithms',
    category: 'course',
    progress: 25,
    maxValue: 32,
    currentValue: 8,
    color: 'blue',
    icon: 'Brain',
    description: 'Fundamental computer science concepts',
    isActive: true,
    animationSpeed: 0.9,
    metadata: {
      difficulty: 'Advanced',
      timeSpent: 30,
      priority: 'high'
    }
  },
  {
    id: 'level_problem_solver',
    title: 'Problem Solver Level 2',
    category: 'level',
    progress: 78,
    maxValue: 800,
    currentValue: 624,
    color: 'pink',
    icon: 'Star',
    description: 'Problem-solving experience points',
    isActive: true,
    animationSpeed: 1.4,
    metadata: {
      priority: 'medium'
    }
  }
];

export default function AnimatedProgressDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [progressData, setProgressData] = useState<ProgressBubbleData[]>(generateDemoProgressData());
  const [selectedBubble, setSelectedBubble] = useState<ProgressBubbleData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate progress updates
  const simulateProgressMutation = useMutation({
    mutationFn: async () => {
      // Simulate realistic progress updates
      const updatedData = progressData.map(bubble => {
        if (bubble.progress < 100 && Math.random() > 0.3) {
          const increment = Math.floor(Math.random() * 15) + 1;
          const newProgress = Math.min(100, bubble.progress + increment);
          return {
            ...bubble,
            progress: newProgress,
            currentValue: Math.floor((newProgress / 100) * bubble.maxValue),
            metadata: {
              ...bubble.metadata,
              lastUpdate: new Date().toISOString()
            }
          };
        }
        return bubble;
      });
      return updatedData;
    },
    onSuccess: (updatedData) => {
      setProgressData(updatedData);
      toast({
        title: "Progress Updated! 🚀",
        description: "Learning progress has been simulated across multiple areas",
      });
    },
  });

  // Add random new progress bubble
  const addRandomBubbleMutation = useMutation({
    mutationFn: async () => {
      const newBubbleTemplates = [
        {
          title: 'Node.js Backend Development',
          category: 'course' as const,
          icon: 'BookOpen',
          description: 'Server-side JavaScript development',
          difficulty: 'Intermediate'
        },
        {
          title: 'Git Version Control',
          category: 'skill' as const,
          icon: 'Target',
          description: 'Master Git workflows and collaboration',
          difficulty: 'Beginner'
        },
        {
          title: 'Team Player Badge',
          category: 'achievement' as const,
          icon: 'Award',
          description: 'Excellent collaboration in team projects',
          difficulty: 'N/A'
        },
        {
          title: 'Weekly Challenge Streak',
          category: 'streak' as const,
          icon: 'Zap',
          description: 'Consistent weekly challenge completion',
          difficulty: 'Medium'
        }
      ];

      const template = newBubbleTemplates[Math.floor(Math.random() * newBubbleTemplates.length)];
      const newBubble: ProgressBubbleData = {
        id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: template.title,
        category: template.category,
        progress: Math.floor(Math.random() * 60) + 10,
        maxValue: Math.floor(Math.random() * 20) + 10,
        currentValue: 0,
        color: template.category === 'course' ? 'blue' : 
               template.category === 'skill' ? 'purple' :
               template.category === 'achievement' ? 'gold' : 'orange',
        icon: template.icon,
        description: template.description,
        isActive: Math.random() > 0.5,
        animationSpeed: Math.random() * 2 + 0.5,
        metadata: {
          difficulty: template.difficulty,
          timeSpent: Math.floor(Math.random() * 120),
          lastUpdate: new Date().toISOString(),
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        }
      };

      newBubble.currentValue = Math.floor((newBubble.progress / 100) * newBubble.maxValue);
      
      return [...progressData, newBubble];
    },
    onSuccess: (updatedData) => {
      setProgressData(updatedData);
      toast({
        title: "New Progress Area Added! ✨",
        description: "A new learning area has been added to your progress tracking",
      });
    },
  });

  // Auto-simulation effect
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        simulateProgressMutation.mutate();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const handleBubbleClick = (bubble: ProgressBubbleData) => {
    setSelectedBubble(bubble);
    toast({
      title: `${bubble.title} Selected`,
      description: `${bubble.progress}% complete - ${bubble.description}`,
    });
  };

  const resetProgress = () => {
    setProgressData(generateDemoProgressData());
    setSelectedBubble(null);
    toast({
      title: "Progress Reset",
      description: "All progress bubbles have been reset to initial state",
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2"><BilingualText text={t('authenticationRequired')} secondaryClassName="text-base opacity-50" /></h3>
            <p className="text-gray-500 mb-6"><BilingualText text={t('pleaseLoginToExperience')} secondaryClassName="text-sm opacity-50" /></p>
            <Button asChild>
              <a href="/auth"><BilingualText text={t('login')} secondaryClassName="text-xs opacity-50" /></a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <BilingualText text={t('home')} className="font-medium" secondaryClassName="text-xs opacity-50" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <BilingualText text={t('back')} className="font-medium" secondaryClassName="text-xs opacity-50" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <BilingualText text={t('animatedLearningProgressBubbles')} />
          </h1>
        </motion.div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          <BilingualText text={t('visualizeLearningJourney')} secondaryClassName="text-base opacity-50" />
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <BilingualText text={t('interactiveAnimations')} secondaryClassName="text-xs opacity-50" />
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            <BilingualText text={t('realTimeUpdates')} secondaryClassName="text-xs opacity-50" />
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-600" />
            <BilingualText text={t('progressTracking')} secondaryClassName="text-xs opacity-50" />
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            <BilingualText text={t('demoControls')} secondaryClassName="text-base opacity-50" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              onClick={() => simulateProgressMutation.mutate()}
              disabled={simulateProgressMutation.isPending}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 min-w-0"
            >
              <BilingualText 
                text={simulateProgressMutation.isPending ? t('updating') : t('simulateProgress')} 
                compact 
                secondaryClassName="text-xs opacity-40" 
              />
            </Button>
            
            <Button
              onClick={() => addRandomBubbleMutation.mutate()}
              disabled={addRandomBubbleMutation.isPending}
              variant="outline"
              className="flex items-center gap-2 min-w-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <BilingualText 
                text={addRandomBubbleMutation.isPending ? t('adding') : t('addRandomBubble')} 
                compact 
                secondaryClassName="text-xs opacity-40" 
              />
            </Button>

            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "destructive" : "default"}
              className="flex items-center gap-2 min-w-0"
            >
              <BilingualText 
                text={isSimulating ? t('stopAutoSimulation') : t('startAutoSimulation')} 
                compact 
                secondaryClassName="text-xs opacity-40" 
              />
            </Button>
            
            <Button
              onClick={resetProgress}
              variant="outline"
              className="flex items-center gap-2 min-w-0"
            >
              <Shuffle className="w-4 h-4 shrink-0" />
              <BilingualText 
                text={t('resetProgress')} 
                compact 
                secondaryClassName="text-xs opacity-40" 
              />
            </Button>
            
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center">
              <Badge variant="outline" className="px-2 py-1 min-w-0">
                <BilingualText 
                  text={`${t('totalBubbles')}: ${progressData.length}`} 
                  compact 
                  secondaryClassName="text-xs opacity-40" 
                />
              </Badge>
              <Badge variant="outline" className="px-2 py-1 min-w-0">
                <BilingualText 
                  text={`${t('completed')}: ${progressData.filter(b => b.progress >= 100).length}`} 
                  compact 
                  secondaryClassName="text-xs opacity-40" 
                />
              </Badge>
              <Badge variant="outline" className="px-2 py-1 min-w-0">
                <BilingualText 
                  text={`${t('active')}: ${progressData.filter(b => b.isActive).length}`} 
                  compact 
                  secondaryClassName="text-xs opacity-40" 
                />
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bubbles Display */}
      <Tabs defaultValue="bubbles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto h-auto">
          <TabsTrigger value="bubbles" className="min-w-0 px-3">
            <BilingualText 
              text={t('interactiveBubbles')} 
              compact 
              secondaryClassName="text-xs opacity-50" 
              className="w-full"
            />
          </TabsTrigger>
          <TabsTrigger value="details" className="min-w-0 px-3">
            <BilingualText 
              text={t('bubbleDetails')} 
              compact 
              secondaryClassName="text-xs opacity-50" 
              className="w-full"
            />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bubbles" className="space-y-6">
          <AnimatedProgressBubbles
            bubbles={progressData}
            onBubbleClick={handleBubbleClick}
            animated={true}
            showControls={true}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedBubble ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${
                      selectedBubble.category === 'course' ? 'from-blue-400 to-blue-600' :
                      selectedBubble.category === 'skill' ? 'from-purple-400 to-purple-600' :
                      selectedBubble.category === 'achievement' ? 'from-yellow-400 to-orange-500' :
                      selectedBubble.category === 'streak' ? 'from-orange-400 to-red-500' :
                      'from-pink-400 to-purple-600'
                    }`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    {selectedBubble.title}
                    <Badge className="capitalize">{selectedBubble.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedBubble.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedBubble.progress}%</div>
                      <div className="text-sm text-muted-foreground"><BilingualText text={t('progress')} secondaryClassName="text-xs opacity-50" /></div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedBubble.currentValue}/{selectedBubble.maxValue}</div>
                      <div className="text-sm text-muted-foreground"><BilingualText text={t('completion')} secondaryClassName="text-xs opacity-50" /></div>
                    </div>
                    {selectedBubble.metadata?.timeSpent && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedBubble.metadata.timeSpent}m</div>
                        <div className="text-sm text-muted-foreground"><BilingualText text={t('timeSpent')} secondaryClassName="text-xs opacity-50" /></div>
                      </div>
                    )}
                    {selectedBubble.metadata?.difficulty && (
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {selectedBubble.metadata.difficulty}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1"><BilingualText text={t('difficulty')} secondaryClassName="text-xs opacity-50" /></div>
                      </div>
                    )}
                  </div>

                  {selectedBubble.metadata?.lastUpdate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <BilingualText text={`${t('lastUpdated')}: ${new Date(selectedBubble.metadata.lastUpdate).toLocaleString()}`} secondaryClassName="text-xs opacity-50" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2"><BilingualText text={t('selectProgressBubble')} secondaryClassName="text-base opacity-50" /></h3>
              <p className="text-muted-foreground mb-6">
                <BilingualText text={t('clickBubbleForDetails')} secondaryClassName="text-sm opacity-50" />
              </p>
              <Button onClick={() => setSelectedBubble(progressData[0])}>
                <BilingualText text={t('viewFirstBubble')} secondaryClassName="text-xs opacity-50" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}