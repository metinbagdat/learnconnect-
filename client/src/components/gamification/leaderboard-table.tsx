import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: number;
  userId: number;
  score: number;
  rank: number;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title: string;
  type: string;
  currentUserId?: number;
}

export function LeaderboardTable({ entries, title, type, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case 'xp':
        return 'XP';
      case 'points':
        return 'Points';
      case 'challenges':
        return 'Challenges';
      case 'courses':
        return 'Courses';
      default:
        return 'Score';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No entries yet</p>
              <p className="text-sm">Be the first to make the leaderboard!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  entry.userId === currentUserId
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'hover:bg-muted/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-2 min-w-[60px]">
                  {getRankIcon(entry.rank)}
                  <Badge variant={getRankBadgeVariant(entry.rank)}>
                    #{entry.rank}
                  </Badge>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.user.avatarUrl} />
                    <AvatarFallback>
                      {entry.user.displayName?.charAt(0) || entry.user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`font-medium ${
                      entry.userId === currentUserId ? 'text-primary' : ''
                    }`}>
                      {entry.user.displayName || entry.user.username}
                      {entry.userId === currentUserId && (
                        <span className="text-xs ml-2 text-primary">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{entry.user.username}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">{entry.score.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{getScoreLabel(type)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}