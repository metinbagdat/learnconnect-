import React, { useState } from "react";
import { X, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Challenge } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface SkillChallengePopupProps {
  challenge: Challenge;
  onAccept: () => void;
  onSkip: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SkillChallengePopup({
  challenge,
  onAccept,
  onSkip,
  open,
  setOpen,
}: SkillChallengePopupProps) {
  const [acceptingChallenge, setAcceptingChallenge] = useState(false);

  const handleAccept = async () => {
    try {
      setAcceptingChallenge(true);
      await apiRequest("POST", `/api/user/challenges/${challenge.id}/assign`);
      toast({
        title: "Challenge Accepted!",
        description: "New challenge has been added to your active challenges.",
      });
      onAccept();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Failed to accept challenge",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setAcceptingChallenge(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    setOpen(false);
  };

  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <DialogTitle>New Skill Challenge!</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full text-white ${getDifficultyColor(
                challenge.difficulty
              )}`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
              {challenge.pointsReward} points
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
              {challenge.xpReward} XP
            </span>
          </div>
          <DialogDescription className="pt-2 text-lg font-semibold">
            {challenge.title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm">{challenge.description}</p>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">Requirements</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {Object.entries(challenge.requirements as Record<string, any>).map(
                ([key, value]) => (
                  <li key={key}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: {value}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={acceptingChallenge}
            className="gap-2"
          >
            Accept Challenge
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}