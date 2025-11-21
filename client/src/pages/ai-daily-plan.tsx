import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Target, 
  TrendingUp,
  RefreshCw,
  CalendarCheck
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  duration: number;
  completed: boolean;
  subject?: string;
}

interface TimeBlock {
  startTime: string;
  endTime: string;
  activity: string;
  focus: string;
}

interface DailyPlan {
  id: number;
  userId: number;
  date: string;
  tasks: Task[];
  timeBlocks: TimeBlock[];
  focusAreas: string[];
  aiRecommendations: string;
  createdAt: string;
}

export default function AIDailyPlan() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Fetch today's plan
  const { data: plan, isLoading } = useQuery<DailyPlan>({
    queryKey: [`/api/ai-daily-plan/${today}`],
    enabled: !!user,
  });

  // Generate plan mutation
  const generatePlan = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/ai-daily-plan/generate`, {
        date: today,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/ai-daily-plan/${today}`] });
      toast({
        title: t("planGeneratedSuccess"),
        description: t("aiRecommendations"),
      });
      setLocalTasks(null); // Reset local state on new plan
    },
    onError: () => {
      toast({
        title: t("planGenerationFailed"),
        description: t("errorGeneratingPlan"),
        variant: "destructive",
      });
    },
  });

  // Initialize local tasks when plan loads
  const tasks = localTasks ?? plan?.tasks ?? [];
  const timeBlocks = plan?.timeBlocks ?? [];
  const focusAreas = plan?.focusAreas ?? [];

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2" data-testid="page-title">
            <Brain className="w-8 h-8 text-primary" />
            {t("aiDailyPlan")}
          </h1>
          <p className="text-muted-foreground mt-1" data-testid="page-subtitle">
            {t("yourPersonalizedPlan")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => generatePlan.mutate()}
            disabled={generatePlan.isPending}
            variant={plan ? "outline" : "default"}
            data-testid="button-generate-plan"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${generatePlan.isPending ? 'animate-spin' : ''}`} />
            {plan ? t("regeneratePlan") : t("generatePlan")}
          </Button>
        </div>
      </div>

      {!plan && !generatePlan.isPending ? (
        // No plan yet state
        <Card className="border-2 border-dashed" data-testid="card-no-plan">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarCheck className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2" data-testid="text-no-plan-title">
              {t("noPlanYet")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md" data-testid="text-no-plan-description">
              {t("clickToGenerate")}
            </p>
            <Button onClick={() => generatePlan.mutate()} size="lg" data-testid="button-generate-first-plan">
              <Sparkles className="w-5 h-5 mr-2" />
              {t("generatePlan")}
            </Button>
          </CardContent>
        </Card>
      ) : generatePlan.isPending ? (
        // Generating state
        <Card data-testid="card-generating">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="w-16 h-16 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium" data-testid="text-generating">
              {t("generatingPlan")}
            </p>
          </CardContent>
        </Card>
      ) : (
        // Plan exists
        <>
          {/* Progress Overview */}
          <Card data-testid="card-progress">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t("yourProgress")}
              </CardTitle>
              <CardDescription>
                {t("planFor")} {new Date(today).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span data-testid="text-tasks-completed">{completedTasks} / {totalTasks} {t("completed")}</span>
                  <span className="text-muted-foreground" data-testid="text-progress-percentage">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" data-testid="progress-bar" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Study Tasks */}
            <Card data-testid="card-study-tasks">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  {t("studyTasks")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-tasks">
                    {t("noPlanYet")}
                  </p>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        task.completed
                          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                          : "border-border hover:border-primary/50 dark:hover:border-primary/50"
                      }`}
                      data-testid={`task-${index}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-1 flex-shrink-0"
                          data-testid={`button-toggle-task-${index}`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={`font-medium ${
                                task.completed ? "line-through text-muted-foreground" : ""
                              }`}
                              data-testid={`text-task-title-${index}`}
                            >
                              {task.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className={`${getPriorityColor(task.priority)} flex-shrink-0`}
                              data-testid={`badge-priority-${index}`}
                            >
                              {t(task.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-task-description-${index}`}>
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1" data-testid={`text-task-duration-${index}`}>
                              <Clock className="w-3 h-3" />
                              {task.duration} {t("minutesShort")}
                            </span>
                            {task.subject && (
                              <span className="flex items-center gap-1" data-testid={`text-task-subject-${index}`}>
                                • {task.subject}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Time Blocks & Focus Areas */}
            <div className="space-y-6">
              {/* Time Blocks */}
              <Card data-testid="card-time-blocks">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t("timeBlocks")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {timeBlocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-time-blocks">
                      {t("noPlanYet")}
                    </p>
                  ) : (
                    timeBlocks.map((block, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted/50 border"
                        data-testid={`time-block-${index}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium" data-testid={`text-time-range-${index}`}>
                            {block.startTime} - {block.endTime}
                          </span>
                        </div>
                        <p className="text-sm font-semibold" data-testid={`text-activity-${index}`}>
                          {block.activity}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1" data-testid={`text-focus-${index}`}>
                          {block.focus}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Focus Areas */}
              <Card data-testid="card-focus-areas">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {t("focusAreas")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {focusAreas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4" data-testid="text-no-focus-areas">
                      {t("noPlanYet")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((area, index) => (
                        <Badge key={index} variant="outline" data-testid={`badge-focus-${index}`}>
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Recommendations */}
          {plan?.aiRecommendations && (
            <Card className="border-primary/20" data-testid="card-ai-recommendations">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t("aiRecommendations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-recommendations">
                  {plan.aiRecommendations}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
