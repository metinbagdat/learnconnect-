import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, Target, TrendingUp, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useLocation } from "wouter";

export default function SmartPlanningDashboard() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [, navigate] = useLocation();

  // Fetch study goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/study-goals"],
  });

  // Fetch study sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/study-sessions"],
  });

  // Fetch progress charts
  const { data: progressData = { sessionsPerDay: [], completedSessions: 0, totalSessions: 0 } } = useQuery({
    queryKey: ["/api/study-progress-charts"],
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/study-goals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-goals"] });
      setShowGoalForm(false);
      toast({ 
        title: t("studyGoalCreated", "Study goal created successfully!"),
        description: t("readyToContinue", "Ready to continue? Check out our curriculum!") 
      });
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create study goal", variant: "destructive" });
    },
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async ({ sessionId, completionRate, focusScore }: any) => {
      return await apiRequest("PATCH", `/api/study-sessions/${sessionId}/complete`, {
        completionRate,
        focusScore,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/study-progress-charts"] });
      toast({ title: "Session marked as complete!" });
    },
    onError: () => {
      toast({ title: "Failed to complete session", variant: "destructive" });
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      targetExam: "TYT",
      studyHoursPerWeek: 10,
      priority: "medium",
      difficulty: "intermediate",
      subjects: "",
      targetDate: "",
    },
  });

  const handleCreateGoal = (data: any) => {
    createGoalMutation.mutate({
      ...data,
      subjects: data.subjects.split(",").map((s: string) => s.trim()),
      targetDate: new Date(data.targetDate),
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <MobileNav />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with CTA */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t("smartPlanning") || "Smart Study Planning"}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">{t("smartPlanningDesc") || "Create personalized study goals and track your progress"}</p>
              </div>
              <Button 
                onClick={() => navigate("/courses")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 whitespace-nowrap"
                data-testid="button-start-learning"
              >
                <BookOpen className="w-4 h-4" />
                {t("startLearning", "Start Learning")}
              </Button>
            </div>

            {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{goals?.filter((g: any) => g.status === "active").length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sessions?.filter((s: any) => s.status === "scheduled").length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sessions?.filter((s: any) => s.status === "completed").length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {progressData?.completedSessions && progressData?.totalSessions
                  ? Math.round((progressData.completedSessions / progressData.totalSessions) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Create Goal Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
              </CardHeader>
              <CardContent>
                {!showGoalForm ? (
                  <Button onClick={() => setShowGoalForm(true)} className="w-full">
                    Add Study Goal
                  </Button>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateGoal)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goal Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., TYT Math Preparation" {...field} data-testid="input-goal-title" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetExam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Exam</FormLabel>
                            <FormControl>
                              <select {...field} className="w-full border rounded px-2 py-1" data-testid="select-target-exam">
                                <option value="TYT">TYT</option>
                                <option value="AYT">AYT</option>
                                <option value="SAT">SAT</option>
                                <option value="IELTS">IELTS</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studyHoursPerWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Study Hours/Week</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-study-hours" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-target-date" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjects (comma-separated)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Math, Physics, Chemistry" {...field} data-testid="input-subjects" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" data-testid="button-create-goal">
                          Create Goal
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)} data-testid="button-cancel">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Goals List and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>Your current study objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goalsLoading ? (
                  <p className="text-slate-500">Loading goals...</p>
                ) : goals?.length ? (
                  goals.map((goal: any) => (
                    <div key={goal.id} className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition" data-testid={`goal-card-${goal.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
                          {goal.targetExam}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{goal.description}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{goal.studyHoursPerWeek} hrs/week</span>
                        <span>Progress: {goal.currentProgress || 0}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-6">No active goals yet. Create one to get started!</p>
                )}
              </CardContent>
            </Card>

            {/* Progress Chart */}
            {progressData?.sessionsPerDay && progressData.sessionsPerDay.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Study Sessions This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData.sessionsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Study Sessions</CardTitle>
            <CardDescription>Your scheduled study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionsLoading ? (
                <p className="text-slate-500">Loading sessions...</p>
              ) : sessions?.filter((s: any) => s.status === "scheduled").length ? (
                sessions
                  .filter((s: any) => s.status === "scheduled")
                  .slice(0, 5)
                  .map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      data-testid={`session-card-${session.id}`}
                    >
                      <div>
                        <p className="font-medium">{session.subject || "Study Session"}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(session.scheduledDate).toLocaleDateString()} • {session.durationMinutes} mins
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          completeSessionMutation.mutate({
                            sessionId: session.id,
                            completionRate: 100,
                            focusScore: 4,
                          })
                        }
                        data-testid={`button-complete-session-${session.id}`}
                      >
                        Complete
                      </Button>
                    </div>
                  ))
              ) : (
                <p className="text-slate-500 text-center py-6">No upcoming sessions. Create a study goal first!</p>
              )}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
