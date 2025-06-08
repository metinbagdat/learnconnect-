import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  BookOpen, 
  Star,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface SocialPost {
  id: number;
  userId: number;
  type: "achievement" | "progress" | "course_completion" | "level_up" | "streak";
  content: string;
  data: any;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
    level: number;
  };
}

export function SocialFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/social/feed"],
    queryFn: async () => {
      // Return sample social feed data for demonstration
      const samplePosts: SocialPost[] = [
        {
          id: 1,
          userId: 1,
          type: "achievement",
          content: "Just unlocked the 'Math Master' achievement!",
          data: {
            achievementName: "Math Master",
            rarity: "epic",
            points: 500,
            description: "Complete 10 advanced mathematics courses"
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 15,
          comments: 3,
          shares: 2,
          isLiked: false,
          user: {
            id: 1,
            username: "mb101",
            displayName: "m bb",
            avatarUrl: null,
            level: 5
          }
        },
        {
          id: 2,
          userId: 2,
          type: "course_completion",
          content: "Just completed 'Advanced React Development' course!",
          data: {
            courseName: "Advanced React Development",
            completionTime: "2 weeks",
            xpEarned: 350,
            grade: "A+"
          },
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          comments: 5,
          shares: 3,
          isLiked: true,
          user: {
            id: 2,
            username: "learner2",
            displayName: "Alex Chen",
            avatarUrl: null,
            level: 3
          }
        },
        {
          id: 3,
          userId: 3,
          type: "level_up",
          content: "Level up! Now at Level 7 with 2,450 total XP!",
          data: {
            newLevel: 7,
            totalXp: 2450,
            xpGained: 150
          },
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          comments: 2,
          shares: 1,
          isLiked: false,
          user: {
            id: 3,
            username: "studybot",
            displayName: "Study Bot",
            avatarUrl: null,
            level: 7
          }
        },
        {
          id: 4,
          userId: 4,
          type: "streak",
          content: "30 day learning streak achieved! Consistency pays off!",
          data: {
            streakDays: 30,
            streakType: "daily_login",
            bonus: 100
          },
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          likes: 20,
          comments: 7,
          shares: 4,
          isLiked: true,
          user: {
            id: 4,
            username: "mathpro",
            displayName: "Math Pro",
            avatarUrl: null,
            level: 6
          }
        }
      ];
      
      return samplePosts;
    },
  });

  const getPostIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "course_completion":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "level_up":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "streak":
        return <Star className="h-5 w-5 text-orange-500" />;
      default:
        return <Users className="h-5 w-5 text-primary" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "achievement":
        return "Achievement Unlocked";
      case "course_completion":
        return "Course Completed";
      case "level_up":
        return "Level Up";
      case "streak":
        return "Streak Milestone";
      default:
        return "Update";
    }
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Learning Community Feed
          </CardTitle>
        </CardHeader>
      </Card>

      {posts?.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatarUrl} />
                  <AvatarFallback>
                    {post.user.displayName?.charAt(0) || post.user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{post.user.displayName || post.user.username}</span>
                    <Badge variant="outline" className="text-xs">
                      Level {post.user.level}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getPostTypeLabel(post.type)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </div>
                
                {getPostIcon(post.type)}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-lg mb-3">{post.content}</p>
                
                {/* Post Type Specific Content */}
                {post.type === "achievement" && post.data && (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-yellow-800">{post.data.achievementName}</h4>
                        <p className="text-sm text-yellow-600">{post.data.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="capitalize mb-1">{post.data.rarity}</Badge>
                        <p className="text-sm font-semibold">+{post.data.points} pts</p>
                      </div>
                    </div>
                  </div>
                )}

                {post.type === "course_completion" && post.data && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-800">{post.data.courseName}</h4>
                        <p className="text-sm text-blue-600">Completed in {post.data.completionTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-800">{post.data.grade}</p>
                        <p className="text-sm">+{post.data.xpEarned} XP</p>
                      </div>
                    </div>
                  </div>
                )}

                {post.type === "level_up" && post.data && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-800">Level {post.data.newLevel} Achieved!</h4>
                        <p className="text-sm text-green-600">Total XP: {post.data.totalXp.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-800">+{post.data.xpGained} XP</p>
                      </div>
                    </div>
                  </div>
                )}

                {post.type === "streak" && post.data && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-orange-800">{post.data.streakDays} Day Streak!</h4>
                        <p className="text-sm text-orange-600">Keep up the momentum!</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-800">+{post.data.bonus} bonus</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 ${
                    post.isLiked || likedPosts.has(post.id) ? 'text-red-500' : ''
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      post.isLiked || likedPosts.has(post.id) ? 'fill-current' : ''
                    }`} 
                  />
                  {post.likes + (likedPosts.has(post.id) && !post.isLiked ? 1 : 0)}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}