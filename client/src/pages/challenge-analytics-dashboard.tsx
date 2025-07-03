import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChallengeAnalytics } from "@/components/analytics/challenge-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Brain, Target, TrendingUp, Trophy, 
  Calendar, Clock, Star, Zap 
} from "lucide-react";

interface QuickStats {
  challengesCompletedToday: number;
  currentStreak: number;
  weeklyXP: number;
  averageScoreThisWeek: number;
  activeLearningPaths: number;
  upcomingChallenges: number;
}

interface TrendingChallenge {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  completionRate: number;
  averageScore: number;
  trending: boolean;
}

export default function ChallengeAnalyticsDashboard() {
  const { data: quickStats, isLoading: statsLoading } = useQuery<QuickStats>({
    queryKey: ["/api/challenge-analytics/quick-stats"],
    queryFn: async () => {
      // Fetch actual user stats or return demo data
      return {
        challengesCompletedToday: 3,
        currentStreak: 5,
        weeklyXP: 156,
        averageScoreThisWeek: 88.4,
        activeLearningPaths: 2,
        upcomingChallenges: 8
      };
    }
  });

  const { data: trendingChallenges } = useQuery<TrendingChallenge[]>({
    queryKey: ["/api/challenges/trending"],
    queryFn: async () => {
      // Fetch trending challenges or return demo data
      return [
        {
          id: 24,
          title: "React Components Basics",
          category: "React",
          difficulty: "easy",
          completionRate: 87,
          averageScore: 91.2,
          trending: true
        },
        {
          id: 15,
          title: "Python Data Types - Intermediate",
          category: "Python",
          difficulty: "medium",
          completionRate: 73,
          averageScore: 84.6,
          trending: true
        },
        {
          id: 21,
          title: "SQL Joins - Advanced",
          category: "Database",
          difficulty: "hard",
          completionRate: 56,
          averageScore: 78.9,
          trending: true
        }
      ];
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Python": "bg-blue-100 text-blue-800",
      "React": "bg-cyan-100 text-cyan-800",
      "Database": "bg-purple-100 text-purple-800",
      "Web Development": "bg-green-100 text-green-800",
      "Mathematics": "bg-orange-100 text-orange-800",
      "Algorithms": "bg-red-100 text-red-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your learning progress and performance
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Challenges</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.challengesCompletedToday}</div>
            <p className="text-xs text-muted-foreground">
              Great progress today!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly XP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.weeklyXP}</div>
            <p className="text-xs text-muted-foreground">
              Experience earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.averageScoreThisWeek}%</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Paths</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.activeLearningPaths}</div>
            <p className="text-xs text-muted-foreground">
              Learning paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats?.upcomingChallenges}</div>
            <p className="text-xs text-muted-foreground">
              New challenges
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="detailed-analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="detailed-analytics">Detailed Analytics</TabsTrigger>
          <TabsTrigger value="trending">Trending Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed-analytics">
          <ChallengeAnalytics />
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Challenges
              </CardTitle>
              <CardDescription>
                Popular challenges based on community engagement and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingChallenges?.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">TRENDING</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(challenge.category)} variant="secondary">
                            {challenge.category}
                          </Badge>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{challenge.completionRate}%</p>
                        <p className="text-muted-foreground">Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{challenge.averageScore}%</p>
                        <p className="text-muted-foreground">Avg Score</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Try Challenge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Progress
                </CardTitle>
                <CardDescription>Your progress towards various learning milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Challenge Master</span>
                    <span className="text-sm text-muted-foreground">18/25</span>
                  </div>
                  <Progress value={72} />
                  <p className="text-xs text-muted-foreground">Complete 25 challenges</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Streak Warrior</span>
                    <span className="text-sm text-muted-foreground">5/10</span>
                  </div>
                  <Progress value={50} />
                  <p className="text-xs text-muted-foreground">Maintain a 10-day streak</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Perfect Scholar</span>
                    <span className="text-sm text-muted-foreground">3/5</span>
                  </div>
                  <Progress value={60} />
                  <p className="text-xs text-muted-foreground">Get perfect scores on 5 challenges</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Focus on Python Advanced</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    You've mastered the basics. Time to tackle advanced Python concepts!
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Challenges
                  </Button>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Try React Development</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Build on your JavaScript knowledge with React components and hooks.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Start Learning Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}