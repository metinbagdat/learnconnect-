import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlayfulLearningAnimations,
  FloatingMascot,
  AchievementCelebration,
  InteractiveSkillTree,
  LearningMascot,
  AchievementCelebration as AchievementType,
  SkillNode
} from '@/components/animations/playful-learning-animations';
import { AnimatedProgressBubbles, ProgressBubbleData } from '@/components/progress/animated-progress-bubbles';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Target, 
  Brain, 
  Rocket, 
  Plus,
  Wand2,
  User,
  BookOpen,
  TrendingUp,
  Zap,
  Clock,
  Award,
  Gift,
  Crown,
  Heart,
  Smile,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo data generators
const generateDemoSkills = (): SkillNode[] => [
  {
    id: 'basic_js',
    title: 'JavaScript Basics',
    level: 3,
    maxLevel: 5,
    isUnlocked: true,
    isActive: true,
    icon: 'BookOpen',
    color: 'from-blue-400 to-blue-600',
    prerequisites: [],
    position: { x: 20, y: 30 },
    rewards: ['XP +100', 'Badge: JS Novice']
  },
  {
    id: 'advanced_js',
    title: 'Advanced JavaScript',
    level: 1,
    maxLevel: 5,
    isUnlocked: false,
    isActive: false,
    icon: 'Brain',
    color: 'from-purple-400 to-purple-600',
    prerequisites: ['basic_js'],
    position: { x: 50, y: 20 },
    rewards: ['XP +200', 'Badge: JS Expert']
  },
  {
    id: 'react_basics',
    title: 'React Fundamentals',
    level: 2,
    maxLevel: 4,
    isUnlocked: true,
    isActive: false,
    icon: 'Target',
    color: 'from-green-400 to-green-600',
    prerequisites: ['basic_js'],
    position: { x: 50, y: 50 },
    rewards: ['XP +150', 'Badge: React Learner']
  },
  {
    id: 'react_hooks',
    title: 'React Hooks',
    level: 0,
    maxLevel: 3,
    isUnlocked: false,
    isActive: false,
    icon: 'Zap',
    color: 'from-yellow-400 to-orange-500',
    prerequisites: ['react_basics'],
    position: { x: 80, y: 40 },
    rewards: ['XP +180', 'Badge: Hook Master']
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    level: 0,
    maxLevel: 4,
    isUnlocked: false,
    isActive: false,
    icon: 'Star',
    color: 'from-indigo-400 to-indigo-600',
    prerequisites: ['advanced_js'],
    position: { x: 80, y: 10 },
    rewards: ['XP +220', 'Badge: Type Safe']
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    level: 0,
    maxLevel: 5,
    isUnlocked: false,
    isActive: false,
    icon: 'Trophy',
    color: 'from-pink-400 to-purple-600',
    prerequisites: ['react_hooks', 'typescript'],
    position: { x: 90, y: 70 },
    rewards: ['XP +500', 'Badge: Full Stack Hero', 'Certificate']
  }
];

const generateDemoAchievements = (): AchievementType[] => [
  {
    id: 'first_lesson',
    title: 'First Lesson Complete!',
    description: 'You completed your very first lesson! Great start on your learning journey.',
    type: 'milestone',
    rarity: 'common',
    icon: 'Star',
    color: 'blue',
    effects: ['confetti', 'sparkles']
  },
  {
    id: 'week_streak',
    title: 'Week Warrior!',
    description: 'Maintained a 7-day learning streak. Consistency is key to mastery!',
    type: 'streak',
    rarity: 'rare',
    icon: 'Trophy',
    color: 'gold',
    effects: ['fireworks', 'glow']
  },
  {
    id: 'skill_master',
    title: 'Skill Mastery Achieved!',
    description: 'You have mastered JavaScript fundamentals. Ready for the next challenge?',
    type: 'mastery',
    rarity: 'epic',
    icon: 'Crown',
    color: 'purple',
    effects: ['confetti', 'sparkles', 'glow']
  },
  {
    id: 'breakthrough',
    title: 'Learning Breakthrough!',
    description: 'You solved a complex problem that challenged you. Incredible growth!',
    type: 'breakthrough',
    rarity: 'legendary',
    icon: 'Rocket',
    color: 'rainbow',
    effects: ['confetti', 'fireworks', 'sparkles', 'glow', 'shake']
  }
];

const generateProgressBubbles = (): ProgressBubbleData[] => [
  {
    id: 'js_progress',
    title: 'JavaScript Mastery',
    category: 'course',
    progress: 75,
    maxValue: 20,
    currentValue: 15,
    color: 'blue',
    icon: 'BookOpen',
    description: 'Building strong JavaScript foundations',
    isActive: true,
    animationSpeed: 1.2,
    metadata: { priority: 'high' }
  },
  {
    id: 'daily_streak',
    title: '14-Day Streak',
    category: 'streak',
    progress: 88,
    maxValue: 30,
    currentValue: 14,
    color: 'orange',
    icon: 'Zap',
    description: 'Consistent daily learning',
    isActive: true,
    animationSpeed: 2.0,
    metadata: { priority: 'high' }
  },
  {
    id: 'problem_solving',
    title: 'Problem Solver',
    category: 'skill',
    progress: 60,
    maxValue: 50,
    currentValue: 30,
    color: 'purple',
    icon: 'Target',
    description: 'Analytical thinking skills',
    isActive: false,
    animationSpeed: 1.5,
    metadata: { priority: 'medium' }
  }
];

export default function PlayfulAnimationsDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Component states
  const [mascot, setMascot] = useState<LearningMascot>({
    id: 'buddy',
    name: 'Learning Buddy',
    mood: 'happy',
    position: { x: 150, y: 150 },
    size: 'medium',
    animation: 'float'
  });
  
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<AchievementType | null>(null);
  const [skillData, setSkillData] = useState<SkillNode[]>(generateDemoSkills());
  const [progressData, setProgressData] = useState<ProgressBubbleData[]>(generateProgressBubbles());
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mascotEnabled, setMascotEnabled] = useState(true);

  // Demo functions
  const triggerRandomAchievement = () => {
    const achievements = generateDemoAchievements();
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    setCurrentAchievement(randomAchievement);
    setShowAchievement(true);
    
    setMascot(prev => ({
      ...prev,
      mood: 'celebrating',
      animation: 'dance',
      message: 'Congratulations! 🎉'
    }));

    toast({
      title: "Achievement Unlocked! 🏆",
      description: randomAchievement.title,
    });
  };

  const changeMascotMood = () => {
    const moods: LearningMascot['mood'][] = ['happy', 'excited', 'focused', 'celebrating', 'encouraging'];
    const animations: LearningMascot['animation'][] = ['bounce', 'dance', 'float', 'spin', 'wave'];
    
    const newMood = moods[Math.floor(Math.random() * moods.length)];
    const newAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    setMascot(prev => ({
      ...prev,
      mood: newMood,
      animation: newAnimation,
      message: `I'm feeling ${newMood}! 😊`
    }));

    setTimeout(() => {
      setMascot(prev => ({ ...prev, message: undefined }));
    }, 2000);
  };

  const simulateProgress = () => {
    setProgressData(prev => prev.map(bubble => ({
      ...bubble,
      progress: Math.min(100, bubble.progress + Math.floor(Math.random() * 20) + 5),
      currentValue: Math.min(bubble.maxValue, bubble.currentValue + Math.floor(Math.random() * 3) + 1)
    })));

    toast({
      title: t('progressUpdated'),
      description: t('learningProgressSimulated'),
    });
  };

  const handleSkillUnlock = (skill: SkillNode) => {
    toast({
      title: t('skillUnlocked'),
      description: `${skill.title} ${t('skillNowAvailable')}`,
    });
    
    // Trigger mini celebration
    setMascot(prev => ({
      ...prev,
      mood: 'excited',
      animation: 'bounce',
      message: t('newSkillUnlocked')
    }));
  };

  const handleAchievementComplete = () => {
    setShowAchievement(false);
    setCurrentAchievement(null);
    setMascot(prev => ({
      ...prev,
      mood: 'happy',
      animation: 'float',
      message: undefined
    }));
  };

  const resetDemo = () => {
    setSkillData(generateDemoSkills());
    setProgressData(generateProgressBubbles());
    setMascot({
      id: 'buddy',
      name: t('learningBuddy'),
      mood: 'happy',
      position: { x: 150, y: 150 },
      size: 'medium',
      animation: 'float'
    });
    setShowAchievement(false);
    setCurrentAchievement(null);
    
    toast({
      title: t('demoReset'),
      description: t('allAnimationsReset'),
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('authenticationRequired')}</h3>
            <p className="text-gray-500 mb-6">{t('pleaseLoginToExperience')}</p>
            <Button asChild>
              <a href="/auth">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PlayfulLearningAnimations 
      config={{
        enableParticles: animationsEnabled,
        enableMascot: mascotEnabled,
        enableSoundEffects: soundEnabled,
        animationSpeed: 1,
        particleCount: 30,
        celebrationDuration: 4000
      }}
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-3">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {t('playfulLearningProgressAnimations')}
            </h1>
          </motion.div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('experienceLearningLikeNever')}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-600" />
              <span>{t('interactiveMascot')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-600" />
              <span>{t('achievementCelebrations')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>{t('skillTreeProgression')}</span>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('animationControls')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={triggerRandomAchievement}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {t('triggerAchievement')}
              </Button>
              
              <Button
                onClick={changeMascotMood}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Smile className="w-4 h-4" />
                {t('changeMascotMood')}
              </Button>

              <Button
                onClick={simulateProgress}
                variant="outline"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {t('simulateProgress')}
              </Button>
              
              <Button
                onClick={resetDemo}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t('resetDemo')}
              </Button>
            </div>
            
            {/* Settings toggles */}
            <div className="flex flex-wrap gap-6 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMascotEnabled(!mascotEnabled)}
                  className={mascotEnabled ? 'text-green-600' : 'text-gray-400'}
                >
                  {mascotEnabled ? <Smile className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </Button>
                <span className="text-sm">{t('mascot')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  className={animationsEnabled ? 'text-green-600' : 'text-gray-400'}
                >
                  {animationsEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <span className="text-sm">{t('animations')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? 'text-green-600' : 'text-gray-400'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <span className="text-sm">{t('sound')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Demo Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skill Tree</TabsTrigger>
            <TabsTrigger value="progress">Progress Bubbles</TabsTrigger>
            <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Current mascot display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Learning Mascot
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg">
                    {mascot.mood === 'happy' && '😊'}
                    {mascot.mood === 'excited' && '🤩'}
                    {mascot.mood === 'focused' && '🤓'}
                    {mascot.mood === 'celebrating' && '🥳'}
                    {mascot.mood === 'encouraging' && '💪'}
                  </div>
                  <div>
                    <p className="font-medium">{mascot.name}</p>
                    <Badge variant="outline" className="capitalize">
                      {mascot.mood} • {mascot.animation}
                    </Badge>
                  </div>
                  {mascot.message && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">{mascot.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Learning Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {skillData.filter(s => s.isUnlocked).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Skills Unlocked</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(progressData.reduce((acc, p) => acc + p.progress, 0) / progressData.length)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {progressData.filter(p => p.progress >= 100).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {progressData.filter(p => p.isActive).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Animation Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Floating Learning Mascot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Achievement Celebrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Interactive Skill Trees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Progress Bubble Animations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>Particle Effects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Interactive Skill Tree
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click on unlocked skills to view details, or unlock new skills by completing prerequisites!
                </p>
              </CardHeader>
              <CardContent>
                <InteractiveSkillTree
                  skills={skillData}
                  onSkillClick={(skill) => {
                    toast({
                      title: skill.title,
                      description: `Level ${skill.level}/${skill.maxLevel} - ${skill.rewards.join(', ')}`,
                    });
                  }}
                  onSkillUnlock={handleSkillUnlock}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <AnimatedProgressBubbles
              bubbles={progressData}
              onBubbleClick={(bubble) => {
                toast({
                  title: bubble.title,
                  description: `${bubble.progress}% complete - ${bubble.description}`,
                });
                
                if (bubble.progress >= 100) {
                  setMascot(prev => ({
                    ...prev,
                    mood: 'celebrating',
                    animation: 'dance',
                    message: 'Amazing work! 🎉'
                  }));
                }
              }}
              animated={animationsEnabled}
              showControls={true}
            />
          </TabsContent>

          <TabsContent value="celebrations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {generateDemoAchievements().map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={() => {
                          setCurrentAchievement(achievement);
                          setShowAchievement(true);
                        }}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                          achievement.rarity === 'common' ? 'from-gray-400 to-gray-600' :
                          achievement.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                          achievement.rarity === 'epic' ? 'from-purple-400 to-purple-600' :
                          'from-yellow-400 to-orange-500'
                        } flex items-center justify-center`}>
                          {achievement.icon === 'Star' && <Star className="w-6 h-6 text-white" />}
                          {achievement.icon === 'Trophy' && <Trophy className="w-6 h-6 text-white" />}
                          {achievement.icon === 'Crown' && <Crown className="w-6 h-6 text-white" />}
                          {achievement.icon === 'Rocket' && <Rocket className="w-6 h-6 text-white" />}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 capitalize ${
                              achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-600' :
                              achievement.rarity === 'epic' ? 'border-purple-400 text-purple-600' :
                              achievement.rarity === 'rare' ? 'border-blue-400 text-blue-600' :
                              'border-gray-400 text-gray-600'
                            }`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {achievement.effects.map((effect) => (
                          <Badge key={effect} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Mascot (when enabled) */}
        {mascotEnabled && (
          <FloatingMascot 
            mascot={mascot} 
            onInteract={() => {
              const messages = [
                "Click around to explore! 🌟",
                "Try triggering an achievement! 🏆",
                "The skill tree is really cool! 🚀",
                "I love learning with you! ❤️"
              ];
              
              setMascot(prev => ({
                ...prev,
                message: messages[Math.floor(Math.random() * messages.length)],
                mood: 'encouraging',
                animation: 'wave'
              }));
              
              setTimeout(() => {
                setMascot(prev => ({ ...prev, message: undefined, mood: 'happy', animation: 'float' }));
              }, 3000);
            }}
          />
        )}

        {/* Achievement Celebration Modal */}
        {currentAchievement && (
          <AchievementCelebration
            achievement={currentAchievement}
            isVisible={showAchievement}
            onComplete={handleAchievementComplete}
          />
        )}
      </div>
    </PlayfulLearningAnimations>
  );
}