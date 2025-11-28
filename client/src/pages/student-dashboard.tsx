import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comprehensive dashboard data
  const { data: dashboardCourses = [] } = useQuery({
    queryKey: [`/api/student/dashboard/${user?.id || 1}`],
  });

  const completeAssignmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/student/assignments/${id}/complete`, { score: 100 });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "✓ Assignment completed!" });
      queryClient.invalidateQueries({ queryKey: [`/api/student/dashboard/${user?.id || 1}`] });
    },
    onError: () => {
      toast({ title: "Failed to complete assignment", variant: "destructive" });
    }
  });

  // Extract flat lists from dashboard data
  const allAssignments = (dashboardCourses as any[]).flatMap(c => c.assignments || []);
  const totalProgress = allAssignments.length > 0 
    ? Math.round((allAssignments.filter(a => a.status === "completed").length / allAssignments.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your courses, assignments, and progress</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="assignments">My Tasks</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="space-y-4">
            {(dashboardCourses as any[])?.length === 0 ? (
              <Card><CardContent className="pt-6 text-center text-muted-foreground">No enrolled courses. Enroll to get started!</CardContent></Card>
            ) : (
              (dashboardCourses as any[]).map((item: any) => {
                const courseProgress = item.studyPlan?.completionPercentage || 0;
                return (
                  <Card key={item.course?.id} data-testid={`card-enrolled-course-${item.course?.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            {item.course?.title}
                          </CardTitle>
                          <CardDescription>{item.course?.description}</CardDescription>
                        </div>
                        <Badge variant={courseProgress === 100 ? "default" : "secondary"}>
                          {courseProgress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-semibold">{courseProgress}%</span>
                        </div>
                        <Progress value={courseProgress} />
                      </div>
                      <Button className="w-full">Continue Learning</Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* ASSIGNMENTS TAB */}
          <TabsContent value="assignments" className="space-y-4">
            {allAssignments?.length === 0 ? (
              <Card><CardContent className="pt-6 text-center text-muted-foreground">No assignments yet. Enroll in a course to get started!</CardContent></Card>
            ) : (
              allAssignments.map((assignment: any) => (
                <Card key={assignment.id} data-testid={`card-assignment-${assignment.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <div className="flex gap-3 mt-3 text-sm flex-wrap">
                          <Badge variant="outline">{assignment.type}</Badge>
                          {assignment.dueDate && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock className="w-4 h-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={assignment.status === "completed" ? "bg-green-600" : "bg-blue-600"}>
                          {assignment.status}
                        </Badge>
                        {assignment.status !== "completed" && (
                          <Button
                            size="sm"
                            onClick={() => completeAssignmentMutation.mutate(assignment.id)}
                            disabled={completeAssignmentMutation.isPending}
                            data-testid={`button-complete-assignment-${assignment.id}`}
                          >
                            {completeAssignmentMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                            )}
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-semibold">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">{allAssignments.length}</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <p className="text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{allAssignments.filter(a => a.status === "completed").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(dashboardCourses as any[]).map((item: any) => (
                    <div key={item.course?.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.course?.title}</span>
                        <span className="font-semibold">{item.studyPlan?.completionPercentage || 0}%</span>
                      </div>
                      <Progress value={item.studyPlan?.completionPercentage || 0} />
                      <span>Module 1: Basics</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Module 2: Advanced</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
