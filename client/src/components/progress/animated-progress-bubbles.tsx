import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  Clock, 
  TrendingUp,
  Zap,
  Award,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export interface ProgressBubbleData {
  id: string;
  title: string;
  category: 'course' | 'skill' | 'achievement' | 'streak' | 'level';
  progress: number; // 0-100
  maxValue: number;
  currentValue: number;
  color: string;
  icon: string;
  description: string;
  isActive: boolean;
  animationSpeed: number; // 1-5 speed multiplier
  metadata?: {
    difficulty?: string;
    timeSpent?: number;
    lastUpdate?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

interface AnimatedProgressBubblesProps {
  bubbles: ProgressBubbleData[];
  onBubbleClick?: (bubble: ProgressBubbleData) => void;
  className?: string;
  animated?: boolean;
  showControls?: boolean;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    BookOpen,
    Target,
    Trophy,
    Star,
    Clock,
    TrendingUp,
    Zap,
    Award,
    CheckCircle2
  };
  return icons[iconName] || BookOpen;
};

const getBubbleColor = (category: string, progress: number) => {
  const colorMap = {
    course: progress >= 100 ? 'from-green-400 to-green-600' : 'from-blue-400 to-blue-600',
    skill: progress >= 100 ? 'from-purple-400 to-purple-600' : 'from-indigo-400 to-indigo-600',
    achievement: 'from-yellow-400 to-orange-500',
    streak: 'from-orange-400 to-red-500',
    level: 'from-pink-400 to-purple-600'
  };
  return colorMap[category as keyof typeof colorMap] || 'from-gray-400 to-gray-600';
};

const ProgressBubble: React.FC<{
  bubble: ProgressBubbleData;
  index: number;
  animated: boolean;
  onClick?: () => void;
}> = ({ bubble, index, animated, onClick }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getIconComponent(bubble.icon);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(bubble.progress);
      }, index * 200);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(bubble.progress);
    }
  }, [bubble.progress, index, animated]);

  const bubbleSize = Math.max(80, Math.min(120, 80 + (bubble.progress / 100) * 40));
  const gradientColor = getBubbleColor(bubble.category, bubble.progress);

  return (
    <motion.div
      layout
      initial={animated ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Outer glow ring for active bubbles */}
      {bubble.isActive && (
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradientColor} opacity-30 blur-md`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: bubbleSize + 20,
            height: bubbleSize + 20,
            left: -10,
            top: -10
          }}
        />
      )}

      {/* Main bubble */}
      <motion.div
        className={`relative rounded-full bg-gradient-to-br ${gradientColor} shadow-lg flex items-center justify-center overflow-hidden`}
        style={{
          width: bubbleSize,
          height: bubbleSize
        }}
        animate={bubble.isActive ? {
          rotate: [0, 360],
        } : {}}
        transition={{
          duration: 10 * bubble.animationSpeed,
          repeat: bubble.isActive ? Infinity : 0,
          ease: "linear"
        }}
      >
        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 45 * (1 - currentProgress / 100)
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Icon and content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <IconComponent className="w-6 h-6 mb-1" />
          <motion.span
            className="text-xs font-bold"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(currentProgress)}%
          </motion.span>
        </div>

        {/* Completion celebration */}
        {currentProgress >= 100 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20" />
            <CheckCircle2 className="w-8 h-8 text-white z-10" />
          </motion.div>
        )}
      </motion.div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap">
              <div className="font-medium">{bubble.title}</div>
              <div className="text-gray-300">
                {bubble.currentValue} / {bubble.maxValue}
              </div>
              {bubble.metadata?.priority && (
                <Badge 
                  variant="outline" 
                  className={`mt-1 text-xs ${
                    bubble.metadata.priority === 'high' ? 'border-red-400 text-red-400' :
                    bubble.metadata.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                    'border-gray-400 text-gray-400'
                  }`}
                >
                  {bubble.metadata.priority}
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles for completed bubbles */}
      {currentProgress >= 100 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ 
                x: bubbleSize / 2, 
                y: bubbleSize / 2, 
                opacity: 0 
              }}
              animate={{
                x: bubbleSize / 2 + Math.cos(i * 60 * Math.PI / 180) * 30,
                y: bubbleSize / 2 + Math.sin(i * 60 * Math.PI / 180) * 30,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const AnimatedProgressBubbles: React.FC<AnimatedProgressBubblesProps> = ({
  bubbles,
  onBubbleClick,
  className = "",
  animated = true,
  showControls = true
}) => {
  const [isAnimating, setIsAnimating] = useState(animated);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(bubbles.map(b => b.category)))];
  const filteredBubbles = selectedCategory === 'all' 
    ? bubbles 
    : bubbles.filter(b => b.category === selectedCategory);

  const overallProgress = bubbles.length > 0 
    ? bubbles.reduce((sum, b) => sum + b.progress, 0) / bubbles.length 
    : 0;

  const completedCount = bubbles.filter(b => b.progress >= 100).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with controls */}
      {showControls && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learning Progress Bubbles
              </CardTitle>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Overall Progress:</span>
                  <Badge variant="outline">
                    {Math.round(overallProgress)}%
                  </Badge>
                  <span className="text-xs">
                    {completedCount} / {bubbles.length} completed
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="flex items-center gap-2"
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAnimating ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAnimating(false);
                      setTimeout(() => setIsAnimating(true), 100);
                    }}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Filter by category:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bubbles grid */}
      <Card>
        <CardContent className="p-8">
          <motion.div
            layout
            className="grid gap-8 justify-items-center"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredBubbles.map((bubble, index) => (
                <ProgressBubble
                  key={bubble.id}
                  bubble={bubble}
                  index={index}
                  animated={isAnimating}
                  onClick={() => onBubbleClick?.(bubble)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredBubbles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No progress bubbles found for the selected category.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
              <span>Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
              <span>Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
              <span>Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
              <span>Streaks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-600" />
              <span>Levels</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimatedProgressBubbles;