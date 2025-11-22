import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { cn } from "@/lib/utils";

interface Achievement {
  id: number;
  title: string;
  description: string;
  category: "academic" | "engagement" | "mastery" | "social";
  pointsReward: number;
  xpReward: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementUnlockModal({ achievement, isOpen, onClose }: AchievementUnlockModalProps) {
  const { language, t } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isOpen && achievement) {
      setShowCelebration(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, achievement, onClose]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "uncommon":
        return "from-green-400 to-green-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-yellow-600";
      default:
        return "from-gray-400 to-gray-600";
    }
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

  if (!achievement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 opacity-50" />
          {showCelebration && (
            <>
              {/* Sparkles animation */}
              {Array.from({ length: 12 }).map((_, i) => (
                <Sparkles
                  key={i}
                  className={cn(
                    "absolute animate-ping text-yellow-400 opacity-75",
                    i % 2 === 0 ? "h-4 w-4" : "h-6 w-6"
                  )}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative z-10 text-center py-6">
          {/* Achievement Icon */}
          <div className="mx-auto mb-6 relative">
            <div
              className={cn(
                "w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br shadow-lg",
                getRarityColor(achievement.rarity)
              )}
            >
              {achievement.rarity === "legendary" ? (
                <Trophy className="h-10 w-10 text-white" />
              ) : (
                <Award className="h-10 w-10 text-white" />
              )}
            </div>
            
            {/* Glow effect for rare+ achievements */}
            {["rare", "epic", "legendary"].includes(achievement.rarity) && (
              <div
                className={cn(
                  "absolute inset-0 w-20 h-20 rounded-full mx-auto animate-pulse bg-gradient-to-br opacity-30",
                  getRarityColor(achievement.rarity)
                )}
                style={{ filter: "blur(8px)" }}
              />
            )}
          </div>

          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {language === 'tr' ? '🎉 Başarı Kazanıldı!' : '🎉 Achievement Unlocked!'}
            </DialogTitle>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {achievement.title}
              </h3>
              
              <div className="flex justify-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "bg-gradient-to-r text-white border-0",
                    getRarityColor(achievement.rarity)
                  )}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {getRarityName(achievement.rarity)}
                </Badge>
                <Badge variant="outline">
                  {getCategoryName(achievement.category)}
                </Badge>
              </div>
            </div>
            
            <DialogDescription className="text-base text-gray-600 max-w-sm mx-auto">
              {achievement.description}
            </DialogDescription>
          </DialogHeader>

          {/* Rewards */}
          <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              {language === 'tr' ? 'Kazanılan Ödüller' : 'Rewards Earned'}
            </h4>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="font-bold text-blue-600">+{achievement.xpReward}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="font-bold text-green-600">+{achievement.pointsReward}</div>
                <div className="text-xs text-gray-500">
                  {language === 'tr' ? 'Puan' : 'Points'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              {language === 'tr' ? 'Harika!' : 'Awesome!'}
            </Button>
            <p className="text-xs text-gray-500">
              {language === 'tr' 
                ? 'Bu modal 5 saniye içinde otomatik kapanacak'
                : 'This modal will close automatically in 5 seconds'
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}