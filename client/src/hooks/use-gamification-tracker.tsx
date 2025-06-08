import React, { createContext, useContext, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AchievementUnlockModal } from "@/components/gamification/achievement-unlock-modal";
import { Achievement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface GamificationContextType {
  showXpGain: (amount: number) => void;
  checkAndUnlockAchievements: (userId: number) => void;
  celebrateLevelUp: (newLevel: number) => void;
  triggerAchievementUnlock: (achievement: Achievement) => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // XP gain notification
  const showXpGain = useCallback((amount: number) => {
    toast({
      title: `+${amount} XP Earned!`,
      description: "Great progress! Keep learning to unlock more rewards.",
      duration: 3000,
    });
  }, [toast]);

  // Level up celebration
  const celebrateLevelUp = useCallback((newLevel: number) => {
    toast({
      title: `🎉 Level Up! Level ${newLevel}`,
      description: "Congratulations! You've reached a new level!",
      duration: 5000,
    });
  }, [toast]);

  // Achievement unlock trigger
  const triggerAchievementUnlock = useCallback((achievement: Achievement) => {
    setUnlockedAchievement(achievement);
    setShowAchievementModal(true);
    
    // Play achievement sound (if available)
    try {
      const audio = new Audio('/achievement-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail if audio not available
    }
  }, []);

  // Check for new achievements
  const achievementCheckMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", "/api/user/check-achievements", { userId });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.newAchievements && data.newAchievements.length > 0) {
        // Show first achievement immediately, queue others
        const [firstAchievement, ...remainingAchievements] = data.newAchievements;
        triggerAchievementUnlock(firstAchievement);
        
        // Queue remaining achievements with delay
        remainingAchievements.forEach((achievement: Achievement, index: number) => {
          setTimeout(() => {
            triggerAchievementUnlock(achievement);
          }, (index + 1) * 3000);
        });
      }
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/user/achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/level"] });
    },
  });

  const checkAndUnlockAchievements = useCallback((userId: number) => {
    achievementCheckMutation.mutate(userId);
  }, [achievementCheckMutation]);

  const handleAchievementModalClose = () => {
    setShowAchievementModal(false);
    setUnlockedAchievement(null);
  };

  return (
    <GamificationContext.Provider
      value={{
        showXpGain,
        checkAndUnlockAchievements,
        celebrateLevelUp,
        triggerAchievementUnlock,
      }}
    >
      {children}
      
      <AchievementUnlockModal
        achievement={unlockedAchievement}
        isOpen={showAchievementModal}
        onClose={handleAchievementModalClose}
      />
    </GamificationContext.Provider>
  );
}

export function useGamificationTracker() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamificationTracker must be used within a GamificationProvider");
  }
  return context;
}