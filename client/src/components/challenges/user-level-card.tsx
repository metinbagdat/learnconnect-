import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Award, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type UserLevel = {
  id: number;
  userId: number;
  level: number;
  currentXp: number;
  totalXp: number;
  nextLevelXp: number;
  streak: number;
  totalPoints: number;
  lastActivityDate: string;
};

export function UserLevelCard() {
  const { data: userLevel, isLoading, error } = useQuery<UserLevel>({
    queryKey: ['/api/user/level'],
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !userLevel) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load your level data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const xpPercentage = (userLevel.currentXp / userLevel.nextLevelXp) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Level {userLevel.level}</span>
          <span className="text-sm font-normal flex items-center text-amber-500">
            <Star className="h-4 w-4 mr-1" />
            {userLevel.totalPoints} Points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Experience</span>
              <span className="text-sm text-muted-foreground">
                {userLevel.currentXp} / {userLevel.nextLevelXp} XP
              </span>
            </div>
            <Progress value={xpPercentage} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Total XP</div>
                <div className="text-xs text-muted-foreground">{userLevel.totalXp} experience points earned</div>
              </div>
            </div>
            <div className="flex items-center">
              <Flame className={`h-5 w-5 mr-2 ${userLevel.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                <div className="text-sm font-medium">Streak</div>
                <div className="text-xs text-muted-foreground">{userLevel.streak} day{userLevel.streak !== 1 ? 's' : ''} in a row</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}