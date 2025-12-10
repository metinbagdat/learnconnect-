import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { challenges as Challenge, userChallenges as UserChallenge } from "@shared/schema";
import { SkillChallengePopup } from "@/components/challenges/skill-challenge-popup";
import type { SkillChallenge } from "@/components/challenges/skill-challenge-popup";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Define types for challenge status data structure
type ChallengeSelect = typeof Challenge.$inferSelect;
type UserChallengeWithChallenge = typeof UserChallenge.$inferSelect & { challenge: ChallengeSelect };

interface UserChallengeStatus {
  active: UserChallengeWithChallenge[];
  completed: UserChallengeWithChallenge[];
}

interface SkillChallengeContextType {
  triggerSkillChallenge: (challengeType?: string) => Promise<void>;
  dismissCurrentChallenge: () => void;
}

const SkillChallengeContext = createContext<SkillChallengeContextType | undefined>(undefined);

export function SkillChallengeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeSelect | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Track which challenges have been shown to the user in this session
  const [shownChallenges, setShownChallenges] = useState<number[]>([]);
  
  // Fetch available skill challenges
  const { data: challenges = [] } = useQuery<ChallengeSelect[]>({
    queryKey: ["/api/challenges"],
    enabled: !!user
  });

  // Fetch user's active challenges to avoid showing challenges already accepted
  const { data: userChallengesData } = useQuery<UserChallengeStatus>({
    queryKey: ["/api/user/challenges/status"],
    enabled: !!user
  });
  
  // Default empty status if data is not yet available
  const userChallenges: UserChallengeStatus = userChallengesData || { 
    active: [], 
    completed: [] 
  };
  
  // Debug logging
  useEffect(() => {
    if (challenges && challenges.length > 0) {
      console.log("Challenges loaded:", challenges.length);
    }
  }, [challenges]);
  
  useEffect(() => {
    if (userChallengesData) {
      console.log("User challenges loaded:", 
        userChallengesData.active?.length || 0, "active,",
        userChallengesData.completed?.length || 0, "completed"
      );
    }
  }, [userChallengesData]);
  
  // Function to find a suitable challenge
  const findSuitableChallenge = (type?: string): ChallengeSelect | null => {
    console.log("Finding challenge of type:", type);

    if (!challenges || challenges.length === 0) {
      console.log("No challenges available");
      return null;
    }
    
    // Get active challenge IDs
    const activeIds = (userChallenges.active || []).map((uc) => {
      const challengeId = uc.challenge?.id;
      return typeof challengeId === "number" ? challengeId : (uc.challengeId || 0);
    });
    const completedIds = (userChallenges.completed || []).map((uc) => {
      const challengeId = uc.challenge?.id;
      return typeof challengeId === "number" ? challengeId : (uc.challengeId || 0);
    });
    
    // Find eligible challenges
    const eligibleChallenges = challenges.filter(
      (challenge) => {
        const challengeId = typeof challenge.id === "number" ? challenge.id : Number(challenge.id) || 0;
        return (
          // Not already active or completed
          !activeIds.includes(challengeId) && 
          !completedIds.includes(challengeId) &&
          // Not shown in this session yet
          !shownChallenges.includes(challengeId) &&
          // Match type if specified
          (!type || (challenge as any).type === type) &&
          // Only skill challenges or specific popup-worthy types
          ((challenge as any).type === 'skill' || (challenge as any).type === 'daily')
        );
      }
    );
    
    console.log("Eligible challenges:", eligibleChallenges.length);
    
    if (eligibleChallenges.length === 0) {
      // Fallback to any challenge for daily challenges
      if (type === "daily") {
        const anyChallenge = challenges.find(c => {
          const challengeId = typeof c.id === "number" ? c.id : Number(c.id) || 0;
          return !activeIds.includes(challengeId) && 
            ((c as any).type === 'daily' || (c as any).type === 'skill');
        });
        
        if (anyChallenge) {
          console.log("Using fallback challenge:", anyChallenge.title);
          return anyChallenge;
        }
        
        // Last resort: just pick the first challenge that's not active
        if (challenges.length > 0) {
          const firstAvailable = challenges[0];
          console.log("Using first available challenge:", firstAvailable.title);
          return firstAvailable;
        }
      }
      
      console.log("No suitable challenges found");
      return null;
    }
    
    // Return a random challenge from eligible ones
    const selectedChallenge = eligibleChallenges[Math.floor(Math.random() * eligibleChallenges.length)];
    console.log("Selected challenge:", selectedChallenge.title);
    return selectedChallenge;
  };
  
  const triggerSkillChallenge = async (challengeType?: string) => {
    console.log("Triggering skill challenge of type:", challengeType);
    
    if (!user) {
      console.error("Cannot trigger challenge: No user logged in");
      return;
    }
    
    const challenge = findSuitableChallenge(challengeType);
    
    if (!challenge) {
      console.log("No suitable challenge found");
      toast({
        title: "No challenges available",
        description: "Try again later when new challenges are available.",
      });
      return;
    }
    
    console.log("Showing challenge:", challenge.title);
    setCurrentChallenge(challenge);
    setIsPopupOpen(true);
    
    // Add to shown challenges
    const challengeId = typeof challenge.id === "number" ? challenge.id : Number(challenge.id) || 0;
    setShownChallenges((prev) => [...prev, challengeId]);
  };
  
  const dismissCurrentChallenge = () => {
    console.log("Dismissing current challenge");
    setIsPopupOpen(false);
    setTimeout(() => setCurrentChallenge(null), 300);
  };
  
  // Handle accepting a challenge
  const handleAcceptChallenge = (success: boolean, points: number, xp: number) => {
    console.log("Challenge completed:", { success, points, xp });
    dismissCurrentChallenge();
  };
  
  const contextValue: SkillChallengeContextType = {
    triggerSkillChallenge,
    dismissCurrentChallenge,
  };
  
  // Helper function to check if challenge has all required properties
  const isValidChallenge = (challenge: ChallengeSelect | null): challenge is ChallengeSelect & SkillChallenge => {
    if (!challenge || typeof challenge !== "object") return false;
    return (
      "type" in challenge &&
      "category" in challenge &&
      "timeLimit" in challenge &&
      "xpReward" in challenge &&
      "question" in challenge &&
      "correctAnswer" in challenge &&
      "explanation" in challenge &&
      "prerequisites" in challenge &&
      "tags" in challenge &&
      "hint" in challenge
    );
  };

  return (
    <SkillChallengeContext.Provider value={contextValue}>
      {children}
      {isValidChallenge(currentChallenge) && (
        <SkillChallengePopup
          challenge={currentChallenge as unknown as SkillChallenge}
          isOpen={isPopupOpen}
          onClose={dismissCurrentChallenge}
          onComplete={handleAcceptChallenge}
        />
      )}
    </SkillChallengeContext.Provider>
  );
}

export function useSkillChallenge() {
  const context = useContext(SkillChallengeContext);
  if (context === undefined) {
    throw new Error("useSkillChallenge must be used within a SkillChallengeProvider");
  }
  return context;
}