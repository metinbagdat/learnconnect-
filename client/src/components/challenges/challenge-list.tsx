import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChallengeCard } from './challenge-card';
import { InteractiveChallengeCard } from '@/components/gamification/interactive-challenge-card';
import { UserLevelCard } from './user-level-card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Challenge = {
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

type UserChallenge = {
  id: number;
  userId: number;
  challengeId: number;
  progress: number;
  isCompleted: boolean;
  pointsEarned: number;
  xpEarned: number;
  createdAt: string;
  completedAt?: string;
  challenge: Challenge;
};

type ChallengeStatus = {
  active: UserChallenge[];
  completed: UserChallenge[];
};

export function ChallengeList() {
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  // Fetch all available challenges
  const { data: availableChallenges = [], isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges', { active: true }],
  });

  // Fetch user's challenges
  const { data: userChallenges = { active: [], completed: [] }, isLoading: isLoadingUserChallenges } = useQuery<ChallengeStatus>({
    queryKey: ['/api/user/challenges/status'],
  });

  // Filter challenges based on selected filters
  const filteredAvailableChallenges = availableChallenges.filter(challenge => {
    const matchesCategory = category === 'all' || challenge.category.toLowerCase() === category.toLowerCase();
    const matchesDifficulty = difficulty === 'all' || challenge.difficulty.toLowerCase() === difficulty.toLowerCase();
    
    // Check if challenge is already assigned to user
    const alreadyAssigned = [...userChallenges.active, ...userChallenges.completed]
      .some(uc => uc.challengeId === challenge.id);
    
    return matchesCategory && matchesDifficulty && !alreadyAssigned;
  });

  const isLoading = isLoadingChallenges || isLoadingUserChallenges;

  return (
    <div className="space-y-6">
      <UserLevelCard />
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active 
            <Badge variant="secondary" className="ml-2">
              {userChallenges.active.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="available">
            Available
            <Badge variant="secondary" className="ml-2">
              {filteredAvailableChallenges.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {userChallenges.completed.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
              ))}
            </div>
          ) : userChallenges.active.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No active challenges</h3>
              <p className="text-muted-foreground">
                Check out the available challenges and start earning rewards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userChallenges.active.map(userChallenge => (
                <InteractiveChallengeCard
                  key={userChallenge.id}
                  challenge={userChallenge.challenge}
                  userChallenge={userChallenge}
                  onProgress={(progress) => {
                    console.log(`Challenge ${userChallenge.challengeId} progress: ${progress}%`);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="mastery">Mastery</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
              ))}
            </div>
          ) : filteredAvailableChallenges.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No available challenges</h3>
              <p className="text-muted-foreground">
                {category !== 'all' || difficulty !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Check back later for new challenges'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailableChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAssign={() => {
                    // This will force refetch after assigning
                    // The API routes already invalidate the cache
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
              ))}
            </div>
          ) : userChallenges.completed.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No completed challenges yet</h3>
              <p className="text-muted-foreground">
                Start working on challenges to earn rewards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userChallenges.completed.map(userChallenge => (
                <InteractiveChallengeCard
                  key={userChallenge.id}
                  challenge={userChallenge.challenge}
                  userChallenge={userChallenge}
                  onProgress={(progress) => {
                    console.log(`Completed challenge ${userChallenge.challengeId} viewed`);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}