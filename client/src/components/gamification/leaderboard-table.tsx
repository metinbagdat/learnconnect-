import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Medal, Trophy, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { LeaderboardEntry, User } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  leaderboardId: number;
  title?: string;
  description?: string;
  limit?: number;
}

export function LeaderboardTable({
  leaderboardId,
  title,
  description,
  limit = 10,
}: LeaderboardTableProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/leaderboards/${leaderboardId}`],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0]);
      if (!response.ok) throw new Error("Failed to load leaderboard");
      return await response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading leaderboard",
      description: (error as Error).message,
      variant: "destructive",
    });
    return null;
  }

  const renderRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return rank;
    }
  };

  const displayTitle = title || data?.name || "Leaderboard";
  const displayDescription = description || data?.description || "";

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>{displayDescription}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.entries?.map((entry: LeaderboardEntry & { user: User }) => (
            <TableRow 
              key={entry.id}
              className={cn(
                entry.user.id === user?.id && "bg-muted/50"
              )}
            >
              <TableCell className="font-medium">
                <div className="flex items-center justify-center">
                  {renderRankIcon(entry.rank)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user.avatarUrl || ""} />
                    <AvatarFallback>{entry.user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{entry.user.displayName}</p>
                    {entry.user.id === user?.id && (
                      <Badge variant="outline" className="mt-1">You</Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-bold">
                {entry.score.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          
          {(!data?.entries || data.entries.length === 0) && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No entries yet. Be the first to join this leaderboard!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}