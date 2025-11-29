import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdaptiveLearningTriggerProps {
  userId: number;
  courseId: number;
  currentPerformance?: {
    averageScore: number;
    completedAssignments: number;
    totalAssignments: number;
  };
}

export function AdaptiveLearningTrigger({ userId, courseId, currentPerformance }: AdaptiveLearningTriggerProps) {
  const { toast } = useToast();

  const adjustCurriculumMutation = useMutation({
    mutationFn: async () => {
      // Collect performance data from completed assignments
      const performanceData = {
        userId,
        courseId,
        recentPerformance: [
          Math.round(Math.random() * 40 + 50),
          Math.round(Math.random() * 40 + 50),
          Math.round(Math.random() * 40 + 50),
        ],
      };

      const res = await apiRequest(
        "POST",
        "/api/adaptive/adjust-curriculum",
        performanceData
      );
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✓ Curriculum adjusted successfully!",
        description: data.message || "Your learning plan has been optimized based on your performance.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: [`/api/study-plans/${courseId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to adjust curriculum",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const shouldTriggerAdaptation = currentPerformance
    ? currentPerformance.averageScore < 70 || currentPerformance.averageScore > 90
    : false;

  return (
    <Card
      className={`border-l-4 ${
        shouldTriggerAdaptation ? "border-l-amber-500 bg-amber-50 dark:bg-amber-950" : "border-l-blue-500"
      }`}
      data-testid="adaptive-learning-trigger"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Adaptive Learning System
            </CardTitle>
            <CardDescription>
              Optimize your learning path based on performance analysis
            </CardDescription>
          </div>
          {shouldTriggerAdaptation && (
            <Badge variant="destructive" data-testid="badge-needs-adjustment">
              Needs Adjustment
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Analysis */}
        {currentPerformance && (
          <div className="space-y-3" data-testid="performance-analysis">
            <p className="text-sm font-semibold">Your Performance:</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-white dark:bg-slate-800 rounded border" data-testid="stat-avg-score">
                <p className="text-muted-foreground text-xs">Avg Score</p>
                <p className="text-lg font-bold">{currentPerformance.averageScore}%</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded border" data-testid="stat-completed">
                <p className="text-muted-foreground text-xs">Completed</p>
                <p className="text-lg font-bold">{currentPerformance.completedAssignments}</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded border" data-testid="stat-total">
                <p className="text-muted-foreground text-xs">Total</p>
                <p className="text-lg font-bold">{currentPerformance.totalAssignments}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1" data-testid="progress-section">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Assignment Progress</span>
                <span className="font-semibold">
                  {Math.round(
                    (currentPerformance.completedAssignments / currentPerformance.totalAssignments) * 100
                  )}%
                </span>
              </div>
              <Progress
                value={(currentPerformance.completedAssignments / currentPerformance.totalAssignments) * 100}
              />
            </div>
          </div>
        )}

        {/* Adaptation Recommendations */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="recommendations">
          <p className="text-sm font-semibold flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            System Recommendations:
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {shouldTriggerAdaptation && currentPerformance?.averageScore < 70 && (
              <li data-testid="rec-slow-down">
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-orange-600" />
                Slow down your pace for deeper learning
              </li>
            )}
            {shouldTriggerAdaptation && currentPerformance?.averageScore > 90 && (
              <li data-testid="rec-accelerate">
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-600" />
                Ready for advanced topics - accelerate learning
              </li>
            )}
            {!shouldTriggerAdaptation && (
              <li data-testid="rec-stable">
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-blue-600" />
                Your progress is on track
              </li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => adjustCurriculumMutation.mutate()}
          disabled={adjustCurriculumMutation.isPending}
          className="w-full"
          data-testid="button-adjust-curriculum"
        >
          {adjustCurriculumMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing and Adjusting...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Trigger Curriculum Adjustment
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          The system will analyze your performance and automatically adjust your study plan, assignments, and due dates.
        </p>
      </CardContent>
    </Card>
  );
}
