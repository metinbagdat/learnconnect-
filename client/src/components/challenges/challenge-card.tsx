import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, XCircle, Clock, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from "@/lib/queryClient";

type ChallengeCardProps = {
  challenge: {
    id: number;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    category: string;
    isActive: boolean;
    pointsReward: number;
    xpReward: number;
    courseId?: number | null;
    badgeId?: number | null;
  };
  userChallenge?: {
    id: number;
    userId: number;
    challengeId: number;
    progress: number;
    isCompleted: boolean;
    pointsEarned: number;
    xpEarned: number;
    createdAt: string;
    completedAt?: string;
  };
  onAssign?: () => void;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'engagement':
      return <Star className="h-4 w-4 mr-1" />;
    case 'achievement':
      return <Trophy className="h-4 w-4 mr-1" />;
    case 'mastery':
      return <Award className="h-4 w-4 mr-1" />;
    case 'time':
      return <Clock className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

export function ChallengeCard({ challenge, userChallenge, onAssign }: ChallengeCardProps) {
  const { toast } = useToast();
  const isAssigned = !!userChallenge;
  const isCompleted = isAssigned && userChallenge.isCompleted;
  
  const handleAssign = async () => {
    try {
      await apiRequest('POST', `/api/user/challenges/${challenge.id}/assign`);
      queryClient.invalidateQueries({ queryKey: ['/api/user/challenges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/challenges/status'] });
      toast({
        title: 'Challenge accepted!',
        description: 'This challenge has been added to your active challenges.',
      });
      if (onAssign) onAssign();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept challenge. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      data-testid={`challenge-card-${challenge.id}`}
    >
      <Card className={`overflow-hidden transition-all duration-300 ${
        isCompleted 
          ? 'border-green-500 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10' 
          : 'hover:shadow-lg hover:border-primary/20'
      }`}>
        {/* Completion Success Animation */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Success gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            
            {/* Floating success particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`success-${i}`}
                className="absolute"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -20]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 1,
                  ease: "easeOut"
                }}
              >
                <Sparkles className="h-3 w-3 text-green-500" />
              </motion.div>
            ))}
          </motion.div>
        )}

        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start">
            <motion.div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{challenge.title}</CardTitle>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
            </motion.div>
            <div className="flex space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="secondary" className="flex items-center">
                  {getCategoryIcon(challenge.category)}
                  {challenge.category}
                </Badge>
              </motion.div>
            </div>
          </div>
          <CardDescription className="text-sm mt-1">{challenge.description}</CardDescription>
        </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{challenge.pointsReward} points</span>
            </span>
            <span className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-blue-500" />
              <span>{challenge.xpReward} XP</span>
            </span>
          </div>
          
          {isAssigned && (
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span>Progress</span>
                <span>{userChallenge.progress}%</span>
              </div>
              <Progress value={userChallenge.progress} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        {!isAssigned ? (
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleAssign} 
              className="w-full" 
              disabled={!challenge.isActive}
              data-testid="button-accept-challenge"
            >
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Accept Challenge
              </motion.div>
            </Button>
          </motion.div>
        ) : isCompleted ? (
          <motion.div
            className="w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <Button 
              variant="ghost" 
              className="w-full text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
              disabled
              data-testid="button-completed"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-4 w-4 mr-2" />
              </motion.div>
              Completed
            </Button>
          </motion.div>
        ) : !challenge.isActive ? (
          <Button 
            variant="ghost" 
            className="w-full text-red-600 dark:text-red-400" 
            disabled
            data-testid="button-expired"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Challenge Expired
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
            data-testid="button-in-progress"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-4 w-4 mr-2" />
            </motion.div>
            In Progress
          </Button>
        )}
      </CardFooter>
    </Card>
    </motion.div>
  );
}