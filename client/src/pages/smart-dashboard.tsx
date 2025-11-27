import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Target, BookOpen, Zap, TrendingUp, Plus } from "lucide-react";

export function SmartDashboard() {
  const { toast } = useToast();
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Fetch goals
  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
  });

  // Fetch course suggestions
  const { data: courseSuggestions } = useQuery({
    queryKey: ["/api/suggestions/courses"],
  });

  // Fetch next steps
  const { data: nextSteps } = useQuery({
    queryKey: ["/api/recommendations/next-steps"],
  });

  // Fetch user interests
  const { data: interests } = useQuery({
    queryKey: ["/api/interests"],
  });

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/goals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({ title: "Goal created", description: "Your goal has been added" });
      setShowGoalForm(false);
    },
  });

  // Enroll in suggested course
  const enrollCourse = useMutation({
    mutationFn: (courseId: number) => apiRequest("POST", "/api/courses/enroll", { courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions/courses"] });
      toast({ title: "Enrolled", description: "You've successfully enrolled in the course" });
    },
  });

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Smart Learning Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">AI-powered personalized learning path</p>
        </div>
        <Button onClick={() => setShowGoalForm(!showGoalForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* Goal Form */}
      {showGoalForm && (
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Set a New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="text" placeholder="Goal text" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
            <select className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600">
              <option value="career">Career</option>
              <option value="skill">Skill</option>
              <option value="certification">Certification</option>
              <option value="personal">Personal</option>
            </select>
            <Button onClick={() => createGoal.mutate({ goalText: "New Goal", goalType: "skill" })}>
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600">{goals?.length || 0}</div>
                <p className="text-slate-600 dark:text-slate-400">Active Goals</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600">{courseSuggestions?.length || 0}</div>
                <p className="text-slate-600 dark:text-slate-400">Recommended Courses</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600">{interests?.length || 0}</div>
                <p className="text-slate-600 dark:text-slate-400">Your Interests</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals">
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals && goals.length > 0 ? (
                goals.map((goal: any) => (
                  <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{goal.goalText}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-sm">
                            {goal.goalType}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded text-sm">
                            Priority: {goal.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{goal.progress}%</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Complete</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-8">No goals set yet. Create one to get started!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions">
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI-Recommended Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseSuggestions && courseSuggestions.length > 0 ? (
                courseSuggestions.map((suggestion: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">Course {suggestion.courseId}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{suggestion.reason}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold">{(suggestion.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => enrollCourse.mutate(suggestion.courseId)}
                        disabled={enrollCourse.isPending}
                      >
                        Enroll
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-8">No course suggestions yet. Set goals or interests first!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="next-steps">
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextSteps && nextSteps.length > 0 ? (
                nextSteps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      step.urgency === "high"
                        ? "bg-red-50 dark:bg-red-900/10 border-red-500"
                        : step.urgency === "medium"
                          ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500"
                          : "bg-blue-50 dark:bg-blue-900/10 border-blue-500"
                    }`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">{step.recommendation}</p>
                    <span className="text-xs mt-2 inline-block px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded">
                      {step.urgency.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-8">Keep going! You're on track.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
