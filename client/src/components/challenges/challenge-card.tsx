import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, XCircle, Clock } from 'lucide-react';
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
    <Card className={`overflow-hidden ${isCompleted ? 'border-green-500 dark:border-green-700' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{challenge.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              {getCategoryIcon(challenge.category)}
              {challenge.category}
            </Badge>
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
          <Button 
            onClick={handleAssign} 
            className="w-full" 
            disabled={!challenge.isActive}
          >
            Accept Challenge
          </Button>
        ) : isCompleted ? (
          <Button variant="ghost" className="w-full text-green-600 dark:text-green-400" disabled>
            <Trophy className="h-4 w-4 mr-2" />
            Completed
          </Button>
        ) : !challenge.isActive ? (
          <Button variant="ghost" className="w-full text-red-600 dark:text-red-400" disabled>
            <XCircle className="h-4 w-4 mr-2" />
            Challenge Expired
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            In Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}