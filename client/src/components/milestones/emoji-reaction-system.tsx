import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Heart, Trophy, Star, Zap, Target, Brain, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LearningMilestone {
  id: string;
  type: 'course_completion' | 'lesson_completion' | 'achievement_unlock' | 'streak_milestone' | 'skill_mastery' | 'challenge_completion';
  title: string;
  description: string;
  courseId?: number;
  lessonId?: number;
  achievementId?: number;
  progress?: number;
  timestamp: string;
  metadata?: {
    courseName?: string;
    lessonTitle?: string;
    achievementName?: string;
    streakDays?: number;
    skillName?: string;
    challengeName?: string;
  };
}

export interface EmojiReaction {
  id: string;
  milestoneId: string;
  userId: number;
  emoji: string;
  aiContext: string;
  timestamp: string;
}

interface EmojiReactionSystemProps {
  milestone: LearningMilestone;
  onReactionAdded?: (reaction: EmojiReaction) => void;
}

export function EmojiReactionSystem({ milestone, onReactionAdded }: EmojiReactionSystemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [aiReaction, setAiReaction] = useState<{ emoji: string; context: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI-powered emoji generation mutation
  const generateEmojiMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/generate-milestone-emoji', {
        milestone,
        userId: user?.id,
        language: 'en' // Could be dynamic based on user preference
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAiReaction(data);
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error('Failed to generate AI emoji reaction:', error);
      setIsGenerating(false);
      toast({
        title: "AI Reaction Failed",
        description: "Couldn't generate a personalized reaction. Try again later.",
        variant: "destructive",
      });
    },
  });

  // Save user's chosen reaction
  const saveReactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      const response = await apiRequest('POST', '/api/milestones/reactions', {
        milestoneId: milestone.id,
        emoji,
        aiContext: aiReaction?.context || '',
      });
      return response.json();
    },
    onSuccess: (reaction) => {
      toast({
        title: "Reaction Saved! 🎉",
        description: "Your milestone celebration has been recorded!",
      });
      onReactionAdded?.(reaction);
    },
    onError: (error) => {
      console.error('Failed to save reaction:', error);
      toast({
        title: "Save Failed",
        description: "Couldn't save your reaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-generate AI reaction when component mounts
  useEffect(() => {
    if (user && !aiReaction && !isGenerating) {
      setIsGenerating(true);
      generateEmojiMutation.mutate();
    }
  }, [user, milestone.id]);

  // Predefined emoji options with context
  const predefinedEmojis = [
    { emoji: '🎉', label: 'Celebration', context: 'Celebrating this achievement!' },
    { emoji: '🚀', label: 'Rocket', context: 'Ready to reach new heights!' },
    { emoji: '⭐', label: 'Star', context: 'Shining bright with this accomplishment!' },
    { emoji: '💪', label: 'Strong', context: 'Feeling empowered and ready for more!' },
    { emoji: '🧠', label: 'Brain', context: 'Knowledge gained and wisdom earned!' },
    { emoji: '🏆', label: 'Trophy', context: 'Victory achieved through dedication!' },
    { emoji: '🔥', label: 'Fire', context: 'On fire with learning momentum!' },
    { emoji: '⚡', label: 'Lightning', context: 'Energized by this breakthrough!' },
  ];

  const getMilestoneIcon = () => {
    switch (milestone.type) {
      case 'course_completion':
        return <Trophy className="h-5 w-5 text-gold-600" />;
      case 'lesson_completion':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'achievement_unlock':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'streak_milestone':
        return <Zap className="h-5 w-5 text-orange-600" />;
      case 'skill_mastery':
        return <Brain className="h-5 w-5 text-purple-600" />;
      case 'challenge_completion':
        return <Rocket className="h-5 w-5 text-green-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const handleEmojiClick = (emoji: string) => {
    saveReactionMutation.mutate(emoji);
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getMilestoneIcon()}
              <div>
                <CardTitle className="text-lg">{milestone.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {milestone.description}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {milestone.type.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Milestone details */}
          <div className="text-sm space-y-1">
            {milestone.metadata?.courseName && (
              <div>
                <span className="font-medium">Course:</span> {milestone.metadata.courseName}
              </div>
            )}
            {milestone.metadata?.lessonTitle && (
              <div>
                <span className="font-medium">Lesson:</span> {milestone.metadata.lessonTitle}
              </div>
            )}
            {milestone.metadata?.streakDays && (
              <div>
                <span className="font-medium">Streak:</span> {milestone.metadata.streakDays} days
              </div>
            )}
            {milestone.progress !== undefined && (
              <div>
                <span className="font-medium">Progress:</span> {milestone.progress}%
              </div>
            )}
          </div>

          {/* AI-generated reaction */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-4"
              >
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">AI is creating your personalized reaction...</p>
              </motion.div>
            )}

            {aiReaction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">AI-Powered Reaction</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{aiReaction.emoji}</span>
                  <p className="text-sm text-muted-foreground flex-1">
                    {aiReaction.context}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleEmojiClick(aiReaction.emoji)}
                    disabled={saveReactionMutation.isPending}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Use This! ✨
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Predefined emoji options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Or choose your celebration:</h4>
            <div className="grid grid-cols-4 gap-2">
              {predefinedEmojis.map((option) => (
                <Tooltip key={option.emoji}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 text-2xl hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                      onClick={() => handleEmojiClick(option.emoji)}
                      disabled={saveReactionMutation.isPending}
                    >
                      {option.emoji}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.context}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Generate new AI reaction button */}
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateEmojiMutation.mutate()}
              disabled={generateEmojiMutation.isPending}
              className="w-full gap-2"
            >
              <Brain className="h-4 w-4" />
              Generate New AI Reaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}