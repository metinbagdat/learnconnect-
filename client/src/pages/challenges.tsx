import React from 'react';
import { ChallengeList } from '@/components/challenges/challenge-list';

export default function ChallengesPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Challenges & Rewards</h1>
        <p className="text-muted-foreground">
          Ready for a challenge? Complete tasks to earn points, XP, and badges. Each challenge helps you level up and unlock new achievements!
        </p>
      </div>
      
      <ChallengeList />
    </div>
  );
}