import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";
import { StudyTimeline } from "@/components/dashboard/study-timeline";
import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics";
import { ToDoList } from "@/components/assignments/todo-list";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

interface DashboardData {
  enrolledCourses: any[];
  currentAssignments: any[];
  overallProgress: number;
  totalEnrolled: number;
  completedCourses: number;
  upcomingAssignments: any[];
  summary: {
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
    overdueAssignments: number;
  };
}

export function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comprehensive dashboard data from backend
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  // Fetch legacy dashboard courses for fallback
  const { data: dashboardCourses = [] } = useQuery({
    queryKey: [`/api/student/dashboard/${user?.id || 1}`],
  });

  // Handle study plan adjustment
  const adjustPlanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/study-plans/${dashboardData?.enrolledCourses?.[0]?.id}/pace`, 
        { pace: "moderate" });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✓ Study plan adjusted!" });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({ title: "Failed to adjust plan", variant: "destructive" });
    }
  });

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    toast({ title: `Exploring: ${suggestion.title}` });
    // Navigate to course or take other action
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Extract data for widgets
  const currentCourse = dashboardData?.enrolledCourses?.[0];
  const nextAssignment = dashboardData?.upcomingAssignments?.[0];
  const completionPercentage = dashboardData?.overallProgress || 0;
  const learningMetrics = {
    averageScore: Math.round(Math.random() * 40 + 60), // placeholder
    completionRate: dashboardData?.summary.completedAssignments 
      ? Math.round((dashboardData.summary.completedAssignments / dashboardData.summary.totalAssignments) * 100)
      : 0,
    totalHoursLearned: Math.round(Math.random() * 20 + 10) // placeholder
  };
  const identifiedStrengths = ["Consistent completion", "Quick learner", "Strong problem-solving"];
  const improvementAreas = ["Quiz performance", "Project depth", "Time management"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2" data-testid="dashboard-header">
          <h1 className="text-4xl font-bold">My Learning Dashboard</h1>
          <p className="text-muted-foreground">
            {dashboardData?.totalEnrolled} active course{dashboardData?.totalEnrolled !== 1 ? "s" : ""} • 
            {dashboardData?.completedCourses} completed
          </p>
        </div>

        {/* Alert for overdue assignments */}
        {(dashboardData?.summary.overdueAssignments || 0) > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950" data-testid="alert-overdue">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Action Needed: {dashboardData?.summary.overdueAssignments} overdue assignment{(dashboardData?.summary.overdueAssignments || 0) !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-red-800 dark:text-red-200">Please complete these as soon as possible</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid - Phase 3.1 */}
        <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="dashboard-grid">
          {/* Progress Widget - spans 2 columns */}
          <div className="lg:col-span-2">
            <ProgressWidget
              currentCourse={currentCourse || { id: 1, title: "No courses", description: "Enroll to get started" }}
              completionPercentage={completionPercentage}
              nextAssignment={nextAssignment || null}
            />
          </div>

          {/* Quick Stats */}
          <Card data-testid="quick-stats-card">
            <CardHeader>
              <CardTitle className="text-base">Assignment Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div data-testid="stat-completed">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{dashboardData?.summary.completedAssignments}</p>
              </div>
              <div data-testid="stat-pending">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData?.summary.pendingAssignments}</p>
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress Indicator */}
          <Card data-testid="progress-indicator-card">
            <CardHeader>
              <CardTitle className="text-base">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-blue-100" />
                  <p className="relative text-3xl font-bold" data-testid="progress-percentage">
                    {completionPercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - AI Suggestions and Study Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Suggestions Widget */}
          <AISuggestions
            onSuggestionSelect={handleSuggestionSelect}
          />

          {/* Study Timeline Widget */}
          <StudyTimeline
            plan={currentCourse ? { id: 1, title: currentCourse.title } : { id: 0, title: "No plan" }}
            assignments={dashboardData?.upcomingAssignments || []}
            onPlanAdjust={() => adjustPlanMutation.mutate()}
          />
        </div>

        {/* Performance Analytics Widget */}
        <div className="grid grid-cols-1">
          <PerformanceAnalytics
            metrics={learningMetrics}
            strengths={identifiedStrengths}
            areasToImprove={improvementAreas}
          />
        </div>

        {/* To-Do List - Shows all pending assignments with due dates */}
        {currentCourse && (
          <div data-testid="todo-section">
            <h2 className="text-2xl font-bold mb-4">My Task List</h2>
            <ToDoList courseId={currentCourse.id} showEmpty={true} />
          </div>
        )}

        {/* Enrolled Courses Overview */}
        {dashboardData?.enrolledCourses && dashboardData.enrolledCourses.length > 1 && (
          <Card data-testid="courses-overview">
            <CardHeader>
              <CardTitle>Your Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="courses-grid">
                {dashboardData.enrolledCourses.map((course, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto flex-col items-start justify-start p-4"
                    data-testid={`course-card-${idx}`}
                  >
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.category}</p>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
