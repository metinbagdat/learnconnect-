import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  Trophy, 
  BookOpen, 
  Star,
  Users,
  Calendar,
  Link as LinkIcon,
  Edit3,
  Share2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SocialShare } from "./social-share";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  joinedAt: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  stats: {
    level: number;
    totalXp: number;
    coursesCompleted: number;
    achievementsUnlocked: number;
    currentStreak: number;
    followers: number;
    following: number;
  };
  achievements: Array<{
    id: number;
    title: string;
    rarity: string;
    unlockedAt: string;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

interface SocialProfileProps {
  userId?: number;
}

export function SocialProfile({ userId }: SocialProfileProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/users/profile", targetUserId],
    queryFn: async () => {
      // Return user profile data - in production this would fetch from API
      const mockProfile: UserProfile = {
        id: targetUserId || 1,
        username: user?.username || "learner",
        displayName: user?.displayName || "Learning Enthusiast",
        bio: "Passionate about learning and technology. Always exploring new skills!",
        avatarUrl: user?.avatarUrl,
        joinedAt: "2024-01-15T00:00:00Z",
        location: "Global",
        website: "https://mylearningjourney.com",
        socialLinks: {
          twitter: "@learner",
          linkedin: "linkedin.com/in/learner",
          github: "github.com/learner"
        },
        stats: {
          level: 5,
          totalXp: 2450,
          coursesCompleted: 12,
          achievementsUnlocked: 8,
          currentStreak: 15,
          followers: 45,
          following: 23
        },
        achievements: [
          {
            id: 1,
            title: "First Steps",
            rarity: "common",
            unlockedAt: "2024-01-20T00:00:00Z"
          },
          {
            id: 2,
            title: "Math Master",
            rarity: "epic",
            unlockedAt: "2024-02-15T00:00:00Z"
          },
          {
            id: 3,
            title: "Streak Warrior",
            rarity: "rare",
            unlockedAt: "2024-03-01T00:00:00Z"
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: "course_completion",
            description: "Completed Advanced React Development",
            createdAt: "2024-03-15T00:00:00Z"
          },
          {
            id: 2,
            type: "achievement",
            description: "Unlocked Math Master achievement",
            createdAt: "2024-03-14T00:00:00Z"
          }
        ]
      };
      
      return mockProfile;
    },
    enabled: !!targetUserId
  });

  const followMutation = useMutation({
    mutationFn: async (action: 'follow' | 'unfollow') => {
      // In production, this would call the API
      return { action, userId: targetUserId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile", targetUserId] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {profile.displayName?.charAt(0) || profile.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => followMutation.mutate('follow')}>
                    <Users className="mr-2 h-4 w-4" />
                    Follow
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                <Badge variant="outline">Level {profile.stats.level}</Badge>
              </div>
              
              <p className="text-muted-foreground mb-1">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-sm mb-4">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                
                {profile.website && (
                  <span className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </span>
                )}
                
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDistanceToNow(new Date(profile.joinedAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex gap-6 text-sm">
                <span>
                  <strong>{profile.stats.followers}</strong> followers
                </span>
                <span>
                  <strong>{profile.stats.following}</strong> following
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{profile.stats.totalXp}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.stats.coursesCompleted}</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{profile.stats.achievementsUnlocked}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{profile.stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-8 w-8 text-yellow-500" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={achievement.rarity === "legendary" ? "default" : "secondary"}
                                className="capitalize text-xs"
                              >
                                {achievement.rarity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {activity.type === "course_completion" ? (
                        <BookOpen className="h-4 w-4 text-primary" />
                      ) : (
                        <Trophy className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Completed Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Course completion history would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <SocialShare
              title={`Check out ${profile.displayName}'s learning profile!`}
              description={`Level ${profile.stats.level} learner with ${profile.stats.totalXp} XP and ${profile.stats.achievementsUnlocked} achievements`}
              type="general"
            />
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}