import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: number;
  userId: number;
  score: number;
  rank: number;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  change?: number; // Position change from previous period
  streak?: number;
  totalPoints?: number;
  totalXp?: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  type: "xp" | "points" | "courses" | "streaks" | "weekly";
  title: string;
  description?: string;
  currentUserId?: number;
  timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  isLoading?: boolean;
}

export function LeaderboardTable({ 
  entries, 
  type, 
  title, 
  description, 
  currentUserId, 
  timeframe = "weekly",
  isLoading = false 
}: LeaderboardTableProps) {
  const { t, language } = useLanguage();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-sm text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case "xp":
        return language === 'tr' ? 'XP' : 'XP';
      case "points":
        return language === 'tr' ? 'Puan' : 'Points';
      case "courses":
        return language === 'tr' ? 'Kurs' : 'Courses';
      case "streaks":
        return language === 'tr' ? 'Seri' : 'Streak';
      case "weekly":
        return language === 'tr' ? 'Haftalık Puan' : 'Weekly Points';
      default:
        return language === 'tr' ? 'Skor' : 'Score';
    }
  };

  const formatScore = (score: number, type: string) => {
    if (type === "courses") {
      return `${score} ${language === 'tr' ? 'kurs' : 'courses'}`;
    }
    if (type === "streaks") {
      return `${score} ${language === 'tr' ? 'gün' : 'days'}`;
    }
    return score.toLocaleString();
  };

  const getChangeIcon = (change?: number) => {
    if (!change || change === 0) return null;
    if (change > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    }
    return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className="bg-white/50">
            <Users className="h-3 w-3 mr-1" />
            {entries.length} {language === 'tr' ? 'oyuncu' : 'players'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-16 text-center">
                {language === 'tr' ? 'Sıra' : 'Rank'}
              </TableHead>
              <TableHead>{language === 'tr' ? 'Oyuncu' : 'Player'}</TableHead>
              <TableHead className="text-right">{getScoreLabel(type)}</TableHead>
              {timeframe !== "all_time" && (
                <TableHead className="w-16 text-center">
                  {language === 'tr' ? 'Değişim' : 'Change'}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={timeframe !== "all_time" ? 4 : 3} className="text-center py-8 text-gray-500">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>{language === 'tr' ? 'Henüz liderlik tablosu verisi yok' : 'No leaderboard data yet'}</p>
                  <p className="text-xs mt-1">
                    {language === 'tr' 
                      ? 'Öğrenmeye başlayın ve liderlik tablosunda yer alın!'
                      : 'Start learning to appear on the leaderboard!'
                    }
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow 
                  key={entry.id}
                  className={cn(
                    "hover:bg-gray-50/50 transition-colors",
                    entry.userId === currentUserId && "bg-blue-50 border-l-4 border-l-blue-500",
                    entry.rank <= 3 && "bg-gradient-to-r from-yellow-50/50 to-transparent"
                  )}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center p-0",
                          getRankBadgeColor(entry.rank)
                        )}
                      >
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.user.avatarUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {entry.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {entry.user.displayName}
                          {entry.userId === currentUserId && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {language === 'tr' ? 'Sen' : 'You'}
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{entry.user.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-sm">
                        {formatScore(entry.score, type)}
                      </span>
                      {entry.streak && entry.streak > 1 && (
                        <div className="flex items-center text-xs text-orange-600">
                          <Star className="h-3 w-3 mr-1" />
                          {entry.streak} {language === 'tr' ? 'gün seri' : 'day streak'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  {timeframe !== "all_time" && (
                    <TableCell className="text-center">
                      {entry.change && (
                        <div className="flex items-center justify-center">
                          {getChangeIcon(entry.change)}
                          <span className={cn(
                            "text-xs ml-1",
                            entry.change > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {Math.abs(entry.change)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {entries.length > 0 && currentUserId && !entries.some(e => e.userId === currentUserId) && (
          <div className="border-t bg-blue-50/50 p-3">
            <div className="text-center text-xs text-gray-600">
              {language === 'tr' 
                ? 'Liderlik tablosunda görünmek için daha fazla öğrenin!'
                : 'Keep learning to appear on the leaderboard!'
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}