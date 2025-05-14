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
  const { data: challenges = [], isLoading: isChallengesLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    enabled: !!user,
    onSuccess: (data) => {
      console.log("Challenges fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching challenges:", error);
    }
  });

  // Fetch user's active challenges to avoid showing challenges already accepted
  const { data: userChallengesData, isLoading: isUserChallengesLoading } = useQuery<UserChallengeStatus>({
    queryKey: ["/api/user/challenges/status"],
    enabled: !!user,
    onSuccess: (data) => {
      console.log("User challenges fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching user challenges:", error);
    }
  });
  
  // Default empty status if data is not yet available
  const userChallenges: UserChallengeStatus = userChallengesData || { 
    active: [], 
    completed: [] 
  };

  // Update session storage when shown challenges change
  useEffect(() => {
    if (shownChallenges.length > 0) {
      sessionStorage.setItem(SHOWN_CHALLENGES_KEY, JSON.stringify(shownChallenges));
    }
  }, [shownChallenges]);

  // Get random skill challenge that hasn't been shown or accepted yet
  const getRandomSkillChallenge = (type?: string) => {
    if (challenges.length === 0) return null;

    // Get active challenge IDs
    const activeIds = userChallenges.active.map((uc) => uc.challenge.id);
    const completedIds = userChallenges.completed.map((uc) => uc.challenge.id);
    
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

    if (eligibleChallenges.length === 0) return null;
    
    // Return a random challenge from eligible ones
    return eligibleChallenges[Math.floor(Math.random() * eligibleChallenges.length)];
  };

  const triggerSkillChallenge = async (challengeType?: string) => {
    if (!user) {
      console.error("Cannot trigger challenge: No user logged in");
      return;
    }

    console.log("Attempting to trigger skill challenge of type:", challengeType);
    
    // If no challenges are loaded yet, fetch them directly
    if (challenges.length === 0) {
      console.log("No challenges found in state, fetching directly");
      try {
        const response = await fetch('/api/challenges');
        const fetchedChallenges: Challenge[] = await response.json();
        console.log("Fetched challenges:", fetchedChallenges);
        
        // Get a default challenge for demonstration if no challenges available
        if (fetchedChallenges.length === 0) {
          console.log("No challenges returned from API");
          return;
        }
        
        // Pick a valid challenge
        const validChallenge = fetchedChallenges.find(c => 
          (challengeType ? c.type === challengeType : (c.type === 'skill' || c.type === 'daily'))
        );
        
        if (!validChallenge) {
          console.log("No matching challenge found in fetched data");
          return;
        }
        
        setCurrentChallenge(validChallenge);
        setIsPopupOpen(true);
        setShownChallenges((prev) => [...prev, validChallenge.id]);
        return;
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
        return;
      }
    }

    const challenge = getRandomSkillChallenge(challengeType);
    if (!challenge) {
      console.log("No eligible challenge found for type:", challengeType);
      // Fallback to any challenge type if specific type not found
      const anyChallenge = challenges[0];
      if (anyChallenge) {
        console.log("Using fallback challenge:", anyChallenge.title);
        setCurrentChallenge(anyChallenge);
        setIsPopupOpen(true);
        setShownChallenges((prev) => [...prev, anyChallenge.id]);
        return;
      }
      return;
    }

    console.log("Showing challenge:", challenge.title);
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