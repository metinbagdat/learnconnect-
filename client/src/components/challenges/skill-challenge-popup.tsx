import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Brain, 
  Target, 
  Trophy, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Star,
  Award,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkillChallenge {
  id: number;
  title: string;
  description: string;
  type: 'multiple_choice' | 'short_answer' | 'coding' | 'drag_drop' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number; // in seconds
  points: number;
  xpReward: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  prerequisites: string[];
  tags: string[];
}

interface SkillChallengePopupProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: SkillChallenge | null;
  onComplete: (success: boolean, points: number, xp: number) => void;
}

export function SkillChallengePopup({ isOpen, onClose, challenge, onComplete }: SkillChallengePopupProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (challenge && isOpen) {
      setTimeRemaining(challenge.timeLimit);
      setCurrentAnswer("");
      setIsSubmitted(false);
      setIsCorrect(null);
      setShowHint(false);
      setIsTimerActive(true);
    }
  }, [challenge, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleSubmit(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, isSubmitted]);

  const handleSubmit = async (timeUp = false) => {
    if (!challenge || !user) return;

    setIsSubmitted(true);
    setIsTimerActive(false);

    const correct = checkAnswer();
    setIsCorrect(correct);

    try {
      const response = await apiRequest('POST', '/api/skill-challenges/submit', {
        challengeId: challenge.id,
        answer: currentAnswer,
        timeSpent: challenge.timeLimit - timeRemaining,
        isCorrect: correct,
        timedOut: timeUp
      });

      const result = await response.json();
      
      if (correct) {
        toast({
          title: "Excellent!",
          description: `You earned ${challenge.points} points and ${challenge.xpReward} XP!`,
        });
        
        // Update user level cache
        queryClient.invalidateQueries({ queryKey: ['/api/user/level'] });
        queryClient.invalidateQueries({ queryKey: ['/api/user/achievements'] });
        
        onComplete(true, challenge.points, challenge.xpReward);
      } else {
        toast({
          title: timeUp ? "Time's up!" : "Not quite right",
          description: "Don't worry, you'll get it next time!",
          variant: "destructive",
        });
        onComplete(false, 0, 0);
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to submit challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const checkAnswer = (): boolean => {
    if (!challenge) return false;

    const userAnswer = currentAnswer.trim().toLowerCase();
    const correctAnswer = challenge.correctAnswer.toLowerCase();

    switch (challenge.type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer === correctAnswer;
      case 'short_answer':
        // More flexible matching for short answers
        return userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
      case 'coding':
        // Basic code comparison (could be enhanced with actual code execution)
        return userAnswer.replace(/\s+/g, '') === correctAnswer.replace(/\s+/g, '');
      default:
        return userAnswer === correctAnswer;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (challenge?.timeLimit || 1)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderQuestionInput = () => {
    if (!challenge) return null;

    switch (challenge.type) {
      case 'multiple_choice':
        return (
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            {challenge.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        );

      case 'short_answer':
        return (
          <Input
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full"
          />
        );

      case 'coding':
        return (
          <Textarea
            placeholder="Write your code here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full min-h-32 font-mono"
          />
        );

      default:
        return (
          <Input
            placeholder="Your answer..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full"
          />
        );
    }
  };

  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Skill Challenge
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {challenge.points}pts
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timer and Progress */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className={cn("h-4 w-4", getTimeColor())} />
              <span className={cn("font-mono font-bold", getTimeColor())}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">{challenge.category}</span>
            </div>
          </div>

          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <p className="text-gray-600">{challenge.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Question:</h4>
                  <p className="text-gray-800">{challenge.question}</p>
                </div>

                {!isSubmitted && (
                  <div>
                    <h4 className="font-medium mb-2">Your Answer:</h4>
                    {renderQuestionInput()}
                  </div>
                )}

                {/* Hint Button */}
                {!isSubmitted && challenge.hint && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                    {showHint && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">{challenge.hint}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Results */}
                {isSubmitted && (
                  <div className="space-y-4">
                    <div className={cn(
                      "p-4 rounded-lg border-2",
                      isCorrect 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={cn(
                          "font-medium",
                          isCorrect ? "text-green-800" : "text-red-800"
                        )}>
                          {isCorrect ? "Correct!" : "Incorrect"}
                        </span>
                        {isCorrect && (
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">+{challenge.xpReward} XP</span>
                          </div>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm",
                        isCorrect ? "text-green-700" : "text-red-700"
                      )}>
                        {challenge.explanation}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Correct Answer:</strong> {challenge.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={!isSubmitted && isTimerActive}
            >
              {isSubmitted ? 'Close' : 'Skip Challenge'}
            </Button>
            
            {!isSubmitted && (
              <Button
                onClick={() => handleSubmit()}
                disabled={!currentAnswer.trim() || !isTimerActive}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Submit Answer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}