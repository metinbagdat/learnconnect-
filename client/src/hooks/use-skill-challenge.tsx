import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Challenge, UserChallenge } from "@shared/schema";
import { SkillChallengePopup } from "@/components/challenges/skill-challenge-popup";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

// Define types for challenge status data structure
interface UserChallengeWithChallenge extends UserChallenge {
  challenge: Challenge;
}

interface UserChallengeStatus {
  active: UserChallengeWithChallenge[];
  completed: UserChallengeWithChallenge[];
}

interface SkillChallengeContextType {
  triggerSkillChallenge: (challengeType?: string) => Promise<void>;
  dismissCurrentChallenge: () => void;
}

const SkillChallengeContext = createContext<SkillChallengeContextType | undefined>(undefined);

// Session storage key to track shown challenges
const SHOWN_CHALLENGES_KEY = "shown_skill_challenges";

export function SkillChallengeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const queryClient = useQueryClient();

  // Track which challenges have been shown to the user in this session
  const [shownChallenges, setShownChallenges] = useState<number[]>(() => {
    const stored = sessionStorage.getItem(SHOWN_CHALLENGES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch available skill challenges
  const { data: challenges } = useQuery({
    queryKey: ["/api/challenges"],
    enabled: !!user,
  });

  // Fetch user's active challenges to avoid showing challenges already accepted
  const { data: userChallenges = { active: [], completed: [] } } = useQuery({
    queryKey: ["/api/user/challenges/status"],
    enabled: !!user,
  });

  // Update session storage when shown challenges change
  useEffect(() => {
    if (shownChallenges.length > 0) {
      sessionStorage.setItem(SHOWN_CHALLENGES_KEY, JSON.stringify(shownChallenges));
    }
  }, [shownChallenges]);

  // Get random skill challenge that hasn't been shown or accepted yet
  const getRandomSkillChallenge = (type?: string) => {
    if (!challenges || !userChallenges) return null;

    // Get active challenge IDs
    const activeIds = (userChallenges.active || []).map((uc: any) => uc.challenge.id);
    const completedIds = (userChallenges.completed || []).map((uc: any) => uc.challenge.id);
    
    // Find eligible challenges
    const eligibleChallenges = (challenges || []).filter(
      (challenge: Challenge) => 
        // Not already active or completed
        !activeIds.includes(challenge.id) && 
        !completedIds.includes(challenge.id) &&
        // Not shown in this session yet
        !shownChallenges.includes(challenge.id) &&
        // Match type if specified
        (!type || challenge.type === type) &&
        // Only skill challenges or specific popup-worthy types
        (challenge.type === 'skill' || challenge.type === 'daily')
    );

    if (eligibleChallenges.length === 0) return null;
    
    // Return a random challenge from eligible ones
    return eligibleChallenges[Math.floor(Math.random() * eligibleChallenges.length)];
  };

  const triggerSkillChallenge = async (challengeType?: string) => {
    if (!user) return;

    const challenge = getRandomSkillChallenge(challengeType);
    if (!challenge) return;

    setCurrentChallenge(challenge);
    setIsPopupOpen(true);
    
    // Add to shown challenges
    setShownChallenges((prev) => [...prev, challenge.id]);
  };

  const dismissCurrentChallenge = () => {
    setIsPopupOpen(false);
    setTimeout(() => setCurrentChallenge(null), 300);
  };

  const handleAcceptChallenge = async () => {
    queryClient.invalidateQueries({ queryKey: ["/api/user/challenges/status"] });
  };

  const contextValue: SkillChallengeContextType = {
    triggerSkillChallenge,
    dismissCurrentChallenge,
  };

  return (
    <SkillChallengeContext.Provider value={contextValue}>
      {children}
      {currentChallenge && (
        <SkillChallengePopup
          challenge={currentChallenge}
          open={isPopupOpen}
          setOpen={setIsPopupOpen}
          onAccept={handleAcceptChallenge}
          onSkip={dismissCurrentChallenge}
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