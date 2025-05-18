import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";
import { Achievement, UserAchievement } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  className?: string;
}

export function AchievementCard({
  achievement,
  userAchievement,
  className,
}: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const earnedDate = userAchievement?.earnedAt 
    ? new Date(userAchievement.earnedAt).toLocaleDateString() 
    : null;
  
  // Determine the color based on rarity
  const rarityColors = {
    common: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    uncommon: "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100",
    rare: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    epic: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    legendary: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100",
  };
  
  const categoryColors = {
    academic: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    engagement: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    mastery: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    social: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
  };
  
  const rarityColor = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common;
  const categoryColor = categoryColors[achievement.category as keyof typeof categoryColors] || categoryColors.academic;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      isUnlocked 
        ? "border-primary/30 shadow-md" 
        : "opacity-70 saturate-50 hover:opacity-80",
      className
    )}>
      <div className={cn(
        "h-2 w-full",
        isUnlocked ? "bg-primary" : "bg-muted"
      )} />
      
      <CardHeader className="relative pt-6 pb-3">
        <div className="absolute -top-8 -ml-3 rounded-full bg-background p-2 border-2 border-background">
          <div className="bg-primary/10 rounded-full p-2">
            {achievement.imageUrl ? (
              <img 
                src={achievement.imageUrl} 
                alt={achievement.title} 
                className="h-8 w-8" 
              />
            ) : (
              <Award className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-start ml-8">
          <div>
            <CardTitle className="text-base">{achievement.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {achievement.description}
            </CardDescription>
          </div>
          
          {!isUnlocked && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge className={rarityColor} variant="outline">
            {achievement.rarity?.charAt(0).toUpperCase() + achievement.rarity?.slice(1)}
          </Badge>
          
          <Badge className={categoryColor} variant="outline">
            {achievement.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 flex justify-between text-xs text-muted-foreground">
        <div>
          +{achievement.pointsReward} points • +{achievement.xpReward} XP
        </div>
        
        {isUnlocked && earnedDate && (
          <div className="font-medium">Earned {earnedDate}</div>
        )}
      </CardFooter>
    </Card>
  );
}