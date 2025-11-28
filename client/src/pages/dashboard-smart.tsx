import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";
import { StudyTimeline } from "@/components/dashboard/study-timeline";
import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function SmartStudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPace, setNewPace] = useState<string>("moderate");
  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/student/dashboard/${user?.id || 1}`],
  });

  // Fetch AI suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ["/api/ai/suggestions", user?.id],
  });

  // Adjust pace mutation
  const adjustPaceMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/study-plan/adjust-pace", {
        courseId,
        newPace,
        reason: "User adjusted pace from dashboard",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✓ Study pace updated successfully!" });
      setIsAdjustingPlan(false);
      queryClient.invalidateQueries({ queryKey: [`/api/student/dashboard/${user?.id || 1}`] });
    },
    onError: () => {
      toast({ title: "Failed to update pace", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const courses = (dashboardData as any[]) || [];
  const currentCourse = courses[0]?.course || null;
  const allAssignments = courses.flatMap((c: any) => c.assignments || []);
  const nextAssignment = allAssignments
    .filter((a: any) => a.status !== "completed")
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const totalProgress = allAssignments.length > 0
    ? Math.round((allAssignments.filter((a: any) => a.status === "completed").length / allAssignments.length) * 100)
    : 0;

  const handleSuggestionSelect = (suggestion: any) => {
    toast({ title: `Viewing: ${suggestion.title}` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Welcome back, {user?.displayName || "Learner"}!</h1>
          <p className="text-muted-foreground">Your personalized learning dashboard</p>
        </div>

        {/* Dashboard Grid - 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Widget */}
          <ProgressWidget
            currentCourse={currentCourse}
            completionPercentage={totalProgress}
            nextAssignment={nextAssignment}
          />

          {/* AI Suggestions */}
          <AISuggestions
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
            isLoading={false}
          />

          {/* Study Timeline */}
          <StudyTimeline
            plan={{ id: 1, title: "30-Day Learning Plan" }}
            assignments={allAssignments}
            onPlanAdjust={() => setIsAdjustingPlan(true)}
          />

          {/* Performance Analytics */}
          <PerformanceAnalytics
            metrics={{
              averageScore: Math.round(totalProgress),
              completionRate: totalProgress,
              totalHoursLearned: Math.floor(allAssignments.length * 1.5),
            }}
            strengths={["Problem Solving", "Time Management", "Consistency"]}
            areasToImprove={["Advanced Topics", "Peer Collaboration"]}
          />
        </div>

        {/* Adjust Plan Dialog */}
        <Dialog open={isAdjustingPlan} onOpenChange={setIsAdjustingPlan}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Your Study Pace</DialogTitle>
              <DialogDescription>
                Choose a pace that works best for you: Slow for deep learning, Moderate for balanced progress, or Fast for quick advancement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Learning Pace</label>
                <Select value={newPace} onValueChange={setNewPace}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">🐢 Slow - Deep Learning</SelectItem>
                    <SelectItem value="moderate">⚡ Moderate - Balanced</SelectItem>
                    <SelectItem value="fast">🚀 Fast - Quick Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => adjustPaceMutation.mutate(currentCourse?.id || 1)}
                disabled={adjustPaceMutation.isPending}
                className="w-full"
              >
                {adjustPaceMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Pace
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
