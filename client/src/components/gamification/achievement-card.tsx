import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award, Crown, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  pointsReward: number;
  xpReward: number;
  rarity: string;
  isActive: boolean;
}

interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  unlockedAt: Date;
  achievement: Achievement;
}

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  isUnlocked: boolean;
  onClaim?: () => void;
}

export function AchievementCard({ 
  achievement, 
  userAchievement, 
  isUnlocked, 
  onClaim 
}: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      case 'uncommon':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'epic':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'rare':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'uncommon':
        return <Award className="h-5 w-5 text-green-500" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRarityBadgeVariant = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'default';
      case 'epic':
        return 'secondary';
      case 'rare':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        isUnlocked 
          ? 'border-primary/20 shadow-lg' 
          : 'border-muted opacity-60 grayscale'
      }`}>
        {/* Background gradient for unlocked achievements */}
        {isUnlocked && (
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-5`} 
          />
        )}

        <CardContent className="p-4 relative">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className={`relative p-3 rounded-full ${
              isUnlocked 
                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}` 
                : 'bg-muted'
            }`}>
              {achievement.imageUrl ? (
                <img 
                  src={achievement.imageUrl} 
                  alt={achievement.title}
                  className="h-8 w-8"
                />
              ) : isUnlocked ? (
                getRarityIcon(achievement.rarity)
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              
              {/* Unlock indicator */}
              {isUnlocked && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Achievement Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold truncate ${
                  isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement.title}
                </h3>
                <Badge variant={getRarityBadgeVariant(achievement.rarity)} className="capitalize">
                  {achievement.rarity}
                </Badge>
              </div>

              <p className={`text-sm mb-3 ${
                isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'
              }`}>
                {achievement.description}
              </p>

              {/* Rewards */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${isUnlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">
                    +{achievement.pointsReward} pts
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className={`h-4 w-4 ${isUnlocked ? 'text-blue-500' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">
                    +{achievement.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Unlock status */}
              {isUnlocked && userAchievement ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">
                    Unlocked {formatDistanceToNow(new Date(userAchievement.unlockedAt), { addSuffix: true })}
                  </span>
                  {onClaim && (
                    <Button size="sm" variant="outline" onClick={onClaim}>
                      View Details
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Not unlocked yet
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress indicator for rare achievements */}
          {achievement.rarity === 'legendary' && isUnlocked && (
            <motion.div
              className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}