import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";

const mockEnrollmentTrend = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 145 },
  { month: "Mar", enrollments: 168 },
  { month: "Apr", enrollments: 195 },
];

export function AdminDashboard() {
  const { data: dashboardData = { totalStudents: 0, totalCourses: 0, totalEnrollments: 0, avgCompletion: 0 } } = useQuery({
    queryKey: ["/api/admin/dashboard"],
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/admin/courses"],
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ["/api/admin/students"],
  });

  const mockCourseStats = (courses as any[]).map((c: any) => ({
    name: c.title || "Unknown",
    students: c.enrollmentCount || 0,
    completion: c.avgCompletion || 0,
  })).slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage courses, students, and platform analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData?.totalStudents || 0}</p>
              <p className="text-xs text-green-600 mt-1">+15% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Active Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData?.totalCourses || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">{dashboardData?.totalEnrollments || 0} enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{Math.round(dashboardData?.avgCompletion || 0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Platform-wide average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dashboardData?.totalEnrollments || 0}</p>
              <p className="text-xs text-blue-600 mt-1">Active enrollments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockEnrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="enrollments" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockCourseStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completion" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COURSES */}
          <TabsContent value="courses" className="space-y-4">
            {(courses as any[])?.length === 0 ? (
              <Card><CardContent className="pt-6 text-center text-muted-foreground">No courses yet</CardContent></Card>
            ) : (
              (courses as any[]).map((course: any) => (
                <Card key={course.id} data-testid={`card-course-${course.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Enrolled Students</p>
                        <p className="text-2xl font-bold">{course.enrollmentCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Completion</p>
                        <p className="text-2xl font-bold">{course.avgCompletion}%</p>
                        <Progress value={course.avgCompletion} className="mt-2" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Assignments</p>
                        <p className="text-2xl font-bold">{course.completedAssignments}/{course.totalAssignments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full">+ Create New Course</Button>
          </TabsContent>

          {/* STUDENTS */}
          <TabsContent value="students" className="space-y-4">
            <p className="text-sm text-muted-foreground">Total active students: {(allStudents as any[])?.length || 0}</p>
            {(allStudents as any[])?.slice(0, 5).map((student: any) => (
              <Card key={student.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{student.displayName || student.username}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                    <Badge>{student.activeCourses || 2} courses</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
