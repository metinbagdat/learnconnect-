import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InteractiveProgressBar } from "./interactive-progress-bar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGamificationTracker } from "@/hooks/use-gamification-tracker";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Target, Clock, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface InteractiveChallengeCardProps {
  challenge: any;
  userChallenge?: any;
  onProgress?: (progress: number) => void;
}

export function InteractiveChallengeCard({
  challenge,
  userChallenge,
  onProgress
}: InteractiveChallengeCardProps) {
  const { user } = useAuth();
  const { showXpGain, checkAndUnlockAchievements } = useGamificationTracker();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const progressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      const response = await apiRequest("PATCH", `/api/user/challenges/${challenge.id}/progress`, {
        progress: newProgress
      });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/challenges/status"] });
      onProgress?.(data.progress);
      
      if (data.progress === 100) {
        showXpGain(challenge.xpReward || 50);
        checkAndUnlockAchievements(user?.id || 0);
      }
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/user/challenges/${challenge.id}/complete`);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/challenges/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/level"] });
      showXpGain(data.xpEarned || challenge.xpReward || 50);
      checkAndUnlockAchievements(user?.id || 0);
    },
  });

  const handleProgressClick = () => {
    const currentProgress = userChallenge?.progress || 0;
    const newProgress = Math.min(currentProgress + 25, 100);
    progressMutation.mutate(newProgress);
  };

  const handleComplete = () => {
    completeMutation.mutate();
  };

  const progress = userChallenge?.progress || 0;
  const isCompleted = userChallenge?.isCompleted || progress >= 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-lg border-primary/30' : 'shadow-md'
      } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600" />
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isCompleted ? 'bg-green-100' : 'bg-primary/10'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Target className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-base">{challenge.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {challenge.description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant={challenge.difficulty === 'easy' ? 'secondary' : 
                            challenge.difficulty === 'medium' ? 'default' : 'destructive'}>
                {challenge.difficulty}
              </Badge>
              {challenge.timeLimit && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {challenge.timeLimit}h
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <InteractiveProgressBar
              current={progress}
              max={100}
              label="Challenge Progress"
              onLevelUp={() => handleComplete()}
            />
          </div>

          {/* Rewards Section */}
          <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{challenge.pointsReward || 25} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{challenge.xpReward || 50} XP</span>
              </div>
            </div>
            
            {!isCompleted && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleProgressClick}
                  disabled={progressMutation.isPending}
                  className="text-xs"
                >
                  {progressMutation.isPending ? "..." : "+25%"}
                </Button>
                {progress >= 75 && (
                  <Button
                    size="sm"
                    onClick={handleComplete}
                    disabled={completeMutation.isPending}
                    className="text-xs"
                  >
                    {completeMutation.isPending ? "..." : "Complete"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Completion Status */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center py-3 bg-green-100 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Challenge Completed!</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}