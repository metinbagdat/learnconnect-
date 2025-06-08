import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Share2, Trophy, TrendingUp, Home, ArrowLeft } from "lucide-react";
import { SocialFeed } from "@/components/social/social-feed";
import { SocialProfile } from "@/components/social/social-profile";
import { SocialShare } from "@/components/social/social-share";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function SocialPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="gap-2 hover:shadow-md hover:scale-105 transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-200">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/gamification">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-200">
                <Trophy className="h-4 w-4" />
                Achievements
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/20 rounded-full p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Learning Community</h1>
            <p className="text-muted-foreground">Connect, share, and celebrate your learning journey</p>
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">3,891</div>
              <div className="text-sm text-muted-foreground">Achievements Shared</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">15,623</div>
              <div className="text-sm text-muted-foreground">Course Completions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">892</div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            My Profile
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Success
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Community Leaders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SocialFeed />
            </div>
            
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">#ReactDevelopment</span>
                    <Badge variant="secondary">124 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">#MathMastery</span>
                    <Badge variant="secondary">89 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">#AchievementUnlocked</span>
                    <Badge variant="secondary">67 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">#StudyStreak</span>
                    <Badge variant="secondary">45 posts</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Study Group Leaders</p>
                      <p className="text-sm text-muted-foreground">Connect with active group organizers</p>
                    </div>
                    <Badge>12 new</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Course Mentors</p>
                      <p className="text-sm text-muted-foreground">Learn from experienced learners</p>
                    </div>
                    <Badge>8 new</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <SocialProfile />
        </TabsContent>

        <TabsContent value="share" className="mt-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Achievement</CardTitle>
                <p className="text-muted-foreground">
                  Celebrate your learning milestones with the community
                </p>
              </CardHeader>
              <CardContent>
                <SocialShare
                  title="Check out my learning progress!"
                  description="Making amazing progress in my learning journey"
                  type="achievement"
                  achievement={{
                    name: "Course Master",
                    rarity: "epic",
                    points: 500
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Course Progress</CardTitle>
                <p className="text-muted-foreground">
                  Show your dedication and progress to inspire others
                </p>
              </CardHeader>
              <CardContent>
                <SocialShare
                  title="Amazing progress in my studies!"
                  description="Consistency and dedication paying off"
                  type="progress"
                  progress={{
                    courseName: "Advanced React Development",
                    completionRate: 85,
                    xpEarned: 450
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Alex Chen", points: 1250, level: 8 },
                    { rank: 2, name: "Study Bot", points: 1100, level: 7 },
                    { rank: 3, name: "Math Pro", points: 950, level: 6 },
                    { rank: 4, name: "m bb", points: 800, level: 5 },
                    { rank: 5, name: "Quick Learner", points: 750, level: 4 }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {user.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">Level {user.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{user.points}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Active Study Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "React Developers", members: 234, activity: "Very Active" },
                    { name: "Math Study Group", members: 189, activity: "Active" },
                    { name: "YKS Preparation", members: 156, activity: "Very Active" },
                    { name: "Python Learners", members: 145, activity: "Active" },
                    { name: "UI/UX Design", members: 98, activity: "Moderate" }
                  ].map((group, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                      </div>
                      <Badge variant={group.activity === "Very Active" ? "default" : "secondary"}>
                        {group.activity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}