import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrolledCourses } = useQuery({
    queryKey: ["/api/student/courses", user?.id],
  });

  const { data: studyPlans } = useQuery({
    queryKey: ["/api/student/study-plans", user?.id],
  });

  const { data: assignments } = useQuery({
    queryKey: ["/api/student/assignments", user?.id],
  });

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
            {enrolledCourses?.map((course: any) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {course.title}
                      </CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <Badge variant={course.completed ? "default" : "secondary"}>
                      {course.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                  <Button className="w-full">Continue Learning</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ASSIGNMENTS TAB */}
          <TabsContent value="assignments" className="space-y-4">
            {assignments?.map((assignment: any) => (
              <Card key={assignment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      <div className="flex gap-3 mt-3 text-sm">
                        <Badge variant="outline">{assignment.type}</Badge>
                        {assignment.dueDate && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-4 h-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={assignment.status === "completed" ? "bg-green-600" : "bg-blue-600"}>
                      {assignment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <p className="text-sm text-muted-foreground">Total Study Time</p>
                    <p className="text-2xl font-bold">24.5 hours</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <p className="text-sm text-muted-foreground">Assignments Completed</p>
                    <p className="text-2xl font-bold">18 / 25</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
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
