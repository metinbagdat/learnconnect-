import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  TrendingUp, Target, Clock, Zap, Trophy, Brain, 
  BarChart3, PieChart as PieChartIcon, Activity 
} from "lucide-react";

interface ChallengeAnalytics {
  totalChallenges: number;
  completedChallenges: number;
  averageScore: number;
  totalXP: number;
  streakRecord: number;
  categoryBreakdown: { category: string; count: number; completed: number }[];
  difficultyBreakdown: { difficulty: string; count: number; avgScore: number }[];
  progressOverTime: { date: string; challenges: number; xp: number }[];
  skillRadar: { skill: string; proficiency: number }[];
  recentActivity: { challengeTitle: string; score: number; date: string; category: string }[];
}

interface LearningPathProgress {
  pathId: number;
  pathTitle: string;
  category: string;
  difficulty: string;
  totalSteps: number;
  completedSteps: number;
  completionPercentage: number;
  totalScore: number;
  estimatedHours: number;
  timeSpent: number;
}

export function ChallengeAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("30d");

  const { data: analytics, isLoading: analyticsLoading } = useQuery<ChallengeAnalytics>({
    queryKey: ["/api/challenge-analytics", selectedTimeframe],
    queryFn: async () => {
      const response = await fetch(`/api/challenge-analytics?timeframe=${selectedTimeframe}`);
      if (!response.ok) {
        // Return basic analytics if API is not implemented yet
        return {
          totalChallenges: 26,
          completedChallenges: 0,
          averageScore: 0,
          totalXP: 0,
          streakRecord: 0,
          categoryBreakdown: [
            { category: "Python", count: 4, completed: 0 },
            { category: "Web Development", count: 3, completed: 0 },
            { category: "React", count: 3, completed: 0 },
            { category: "Mathematics", count: 2, completed: 0 },
            { category: "Database", count: 3, completed: 0 },
            { category: "Algorithms", count: 2, completed: 0 },
          ],
          difficultyBreakdown: [
            { difficulty: "Easy", count: 8, avgScore: 0 },
            { difficulty: "Medium", count: 7, avgScore: 0 },
            { difficulty: "Hard", count: 3, avgScore: 0 },
          ],
          progressOverTime: [
            { date: "Week 1", challenges: 0, xp: 0 },
            { date: "Week 2", challenges: 0, xp: 0 },
            { date: "Week 3", challenges: 0, xp: 0 },
            { date: "Week 4", challenges: 0, xp: 0 },
          ],
          skillRadar: [
            { skill: "Programming", proficiency: 0 },
            { skill: "Problem Solving", proficiency: 0 },
            { skill: "Web Development", proficiency: 0 },
            { skill: "Database Design", proficiency: 0 },
            { skill: "Algorithms", proficiency: 0 },
            { skill: "Math", proficiency: 0 },
          ],
          recentActivity: []
        };
      }
      return response.json();
    }
  });

  const { data: pathProgress, isLoading: pathLoading } = useQuery<LearningPathProgress[]>({
    queryKey: ["/api/user/learning-path-progress"],
    queryFn: async () => {
      const response = await fetch("/api/user/learning-path-progress");
      if (!response.ok) {
        return [];
      }
      return response.json();
    }
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (analyticsLoading || pathLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Challenge Analytics</h2>
          <p className="text-muted-foreground">Track your learning progress and performance</p>
        </div>
        <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalChallenges}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completedChallenges} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across all challenges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalXP}</div>
            <p className="text-xs text-muted-foreground">
              Experience points earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.streakRecord}</div>
            <p className="text-xs text-muted-foreground">
              Consecutive correct answers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalChallenges ? Math.round((analytics?.completedChallenges / analytics?.totalChallenges) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="skills">Skills Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="challenges" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="xp" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Difficulty Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.difficultyBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ difficulty, count }) => `${difficulty}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics?.difficultyBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest challenge completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">{activity.challengeTitle}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{activity.category}</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {activity.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
              <CardDescription>Your progress across different skill areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics?.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
                  <Bar dataKey="count" stackId="a" fill="#8884d8" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Skills Proficiency Radar
              </CardTitle>
              <CardDescription>Your skill levels across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analytics?.skillRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={0} domain={[0, 100]} />
                  <Radar name="Proficiency" dataKey="proficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}