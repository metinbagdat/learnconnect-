import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Lock, CheckCircle, Trophy, Target, Users, BookOpen, Flame } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Achievement {
  id: number;
  title: string;
  description: string;
  category: "academic" | "engagement" | "mastery" | "social";
  imageUrl?: string;
  pointsReward: number;
  xpReward: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  isActive: boolean;
}

interface UserAchievement {
  id: number;
  achievement: Achievement;
  earnedAt: string;
  pointsEarned: number;
  xpEarned: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  progress?: number; // 0-100 for locked achievements
  isUnlocked?: boolean;
  showProgress?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function AchievementCard({ 
  achievement, 
  userAchievement, 
  progress = 0, 
  isUnlocked = false, 
  showProgress = false,
  compact = false,
  onClick 
}: AchievementCardProps) {
  const { t, language } = useLanguage();
  
  const unlocked = !!userAchievement || isUnlocked;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "uncommon":
        return "bg-green-100 text-green-800 border-green-300";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-50 to-gray-100";
      case "uncommon":
        return "from-green-50 to-green-100";
      case "rare":
        return "from-blue-50 to-blue-100";
      case "epic":
        return "from-purple-50 to-purple-100";
      case "legendary":
        return "from-yellow-50 to-yellow-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4" />;
      case "engagement":
        return <Flame className="h-4 w-4" />;
      case "mastery":
        return <Target className="h-4 w-4" />;
      case "social":
        return <Users className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    if (language === 'tr') {
      switch (category) {
        case "academic":
          return "Akademik";
        case "engagement":
          return "Katılım";
        case "mastery":
          return "Ustalık";
        case "social":
          return "Sosyal";
        default:
          return "Başarı";
      }
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getRarityName = (rarity: string) => {
    if (language === 'tr') {
      switch (rarity) {
        case "common":
          return "Yaygın";
        case "uncommon":
          return "Nadir";
        case "rare":
          return "Ender";
        case "epic":
          return "Destansı";
        case "legendary":
          return "Efsanevi";
        default:
          return "Yaygın";
      }
    }
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
          unlocked 
            ? `bg-gradient-to-r ${getRarityGradient(achievement.rarity)} border-opacity-50` 
            : "bg-gray-50 border-gray-200 opacity-75",
          "hover:shadow-md"
        )}
        onClick={onClick}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          unlocked ? "bg-white/80" : "bg-gray-200"
        )}>
          {unlocked ? (
            <Trophy className={cn(
              "h-6 w-6",
              achievement.rarity === "legendary" ? "text-yellow-600" : "text-primary"
            )} />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm truncate",
            unlocked ? "text-gray-900" : "text-gray-500"
          )}>
            {achievement.title}
          </h4>
          <p className={cn(
            "text-xs truncate",
            unlocked ? "text-gray-600" : "text-gray-400"
          )}>
            {achievement.description}
          </p>
        </div>
        
        {unlocked && userAchievement && (
          <div className="text-right">
            <div className="text-xs text-green-600 font-medium">
              +{userAchievement.xpEarned} XP
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(userAchievement.earnedAt))} ago
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer",
        unlocked 
          ? "shadow-md hover:shadow-lg border-opacity-50" 
          : "opacity-75 hover:opacity-90",
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardHeader className={cn(
        "pb-3",
        unlocked 
          ? `bg-gradient-to-r ${getRarityGradient(achievement.rarity)}` 
          : "bg-gray-50"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              unlocked ? "bg-white/80 shadow-sm" : "bg-gray-200"
            )}>
              {unlocked ? (
                achievement.rarity === "legendary" ? (
                  <Trophy className="h-7 w-7 text-yellow-600" />
                ) : (
                  <CheckCircle className="h-7 w-7 text-green-600" />
                )
              ) : (
                <Lock className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <CardTitle className={cn(
                "text-lg",
                unlocked ? "text-gray-900" : "text-gray-500"
              )}>
                {achievement.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getRarityColor(achievement.rarity))}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {getRarityName(achievement.rarity)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getCategoryIcon(achievement.category)}
                  <span className="ml-1">{getCategoryName(achievement.category)}</span>
                </Badge>
              </div>
            </div>
          </div>
          
          {unlocked && userAchievement && (
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">
                +{userAchievement.xpEarned} XP
              </div>
              <div className="text-xs text-gray-500">
                +{userAchievement.pointsEarned} {language === 'tr' ? 'puan' : 'points'}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-3">
        <CardDescription className={cn(
          "text-sm mb-3",
          unlocked ? "text-gray-600" : "text-gray-400"
        )}>
          {achievement.description}
        </CardDescription>
        
        {!unlocked && showProgress && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                {language === 'tr' ? 'İlerleme' : 'Progress'}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {!unlocked && !showProgress && (
          <div className="text-center py-2">
            <div className="text-sm font-medium text-gray-500 mb-1">
              {language === 'tr' ? 'Ödüller' : 'Rewards'}
            </div>
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center text-blue-600">
                <Award className="h-3 w-3 mr-1" />
                {achievement.xpReward} XP
              </div>
              <div className="flex items-center text-green-600">
                <Star className="h-3 w-3 mr-1" />
                {achievement.pointsReward} {language === 'tr' ? 'puan' : 'points'}
              </div>
            </div>
          </div>
        )}
        
        {unlocked && userAchievement && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700 font-medium">
                {language === 'tr' ? 'Kazanıldı' : 'Earned'}
              </span>
              <span className="text-green-600">
                {formatDistanceToNow(new Date(userAchievement.earnedAt))} 
                {language === 'tr' ? ' önce' : ' ago'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}