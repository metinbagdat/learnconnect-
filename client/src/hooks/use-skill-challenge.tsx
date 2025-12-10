import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { challenges as Challenge, userChallenges as UserChallenge } from "@shared/schema";
import { SkillChallengePopup } from "@/components/challenges/skill-challenge-popup";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Define types for challenge status data structure
type UserChallengeWithChallenge = typeof UserChallenge & { challenge: typeof Challenge };

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
  const [currentChallenge, setCurrentChallenge] = useState<typeof Challenge | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Track which challenges have been shown to the user in this session
  const [shownChallenges, setShownChallenges] = useState<number[]>([]);
  
  // Fetch available skill challenges
  const { data: challenges = [] } = useQuery<typeof Challenge[]>({
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
  const findSuitableChallenge = (type?: string): Challenge | null => {
    console.log("Finding challenge of type:", type);
    
    if (!challenges || challenges.length === 0) {
      console.log("No challenges available");
      return null;
    }
    
    // Get active challenge IDs
    const activeIds = (userChallenges.active || []).map((uc) => uc.challenge?.id || uc.challengeId || 0);
    const completedIds = (userChallenges.completed || []).map((uc) => uc.challenge?.id || uc.challengeId || 0);
    
    // Find eligible challenges
    const eligibleChallenges = challenges.filter(
      (challenge) => 
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
    
    console.log("Eligible challenges:", eligibleChallenges.length);
    
    if (eligibleChallenges.length === 0) {
      // Fallback to any challenge for daily challenges
      if (type === "daily") {
        const anyChallenge = challenges.find(c => 
          !activeIds.includes(c.id) && 
          (c.type === 'daily' || c.type === 'skill')
        );
        
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
    setShownChallenges((prev) => [...prev, challenge.id]);
  };
  
  const dismissCurrentChallenge = () => {
    console.log("Dismissing current challenge");
    setIsPopupOpen(false);
    setTimeout(() => setCurrentChallenge(null), 300);
  };
  
  // Handle accepting a challenge
  const handleAcceptChallenge = async () => {
    console.log("Challenge accepted");
    dismissCurrentChallenge();
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