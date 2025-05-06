import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Loader2, Calendar, Users, BookOpen, GraduationCap, Award, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";

// Define types for the analytics data
interface UserActivity {
  id: number;
  userId: number;
  action: string;
  resourceType?: string;
  resourceId?: number;
  details?: string;
  createdAt: string;
}

interface UserProgressSnapshot {
  id: number;
  userId: number;
  snapshotDate: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  assignmentsCompleted: number;
  totalPoints: number;
  badgesEarned: number;
  averageGrade: number;
}

interface CourseAnalytic {
  id: number;
  courseId: number;
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  averageCompletionTime?: number;
  course: {
    id: number;
    title: string;
    category: string;
  };
}

interface PlatformStats {
  totalUsers: number;
  totalCourses: number;
  totalLessonsCompleted: number;
  totalAssignmentsCompleted: number;
  averageGrade: number;
}

// Define color schemes
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#3CB371", "#FF6347"];
const ACTIVITY_COLORS: Record<string, string> = {
  "login": "#0088FE",
  "view_course": "#00C49F",
  "complete_lesson": "#FFBB28",
  "submit_assignment": "#FF8042",
  "start_course": "#A020F0",
  "earn_badge": "#3CB371",
  "view_dashboard": "#FF6347"
};

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Platform-level statistics (admin only)
  const { data: platformStats, isLoading: loadingPlatformStats } = useQuery<PlatformStats>({
    queryKey: ["/api/analytics/platform-stats"],
    enabled: user?.role === "admin", // Only run this query for admins
  });
  
  // User activity data
  const { data: userActivities, isLoading: loadingUserActivities } = useQuery<UserActivity[]>({
    queryKey: ["/api/analytics/user-activities"],
  });
  
  // User progress over time
  const { data: userProgress, isLoading: loadingUserProgress } = useQuery<UserProgressSnapshot[]>({
    queryKey: [
      "/api/analytics/user-progress", 
      {
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString()
      }
    ],
    enabled: Boolean(dateRange.from && dateRange.to)
  });
  
  // Popular courses data
  const { data: popularCourses, isLoading: loadingPopularCourses } = useQuery<CourseAnalytic[]>({
    queryKey: ["/api/analytics/popular-courses"]
  });
  
  // Process activity data for visualization
  const activityData = userActivities ? 
    Object.entries(
      userActivities.reduce((acc: Record<string, number>, item: UserActivity) => {
        const action = item.action;
        if (!acc[action]) acc[action] = 0;
        acc[action]++;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value })) 
    : [];
  
  // Format progress data for line chart
  const progressData = userProgress ? 
    userProgress.map((snapshot: UserProgressSnapshot) => ({
      date: format(new Date(snapshot.snapshotDate), 'MMM dd'),
      coursesCompleted: snapshot.coursesCompleted,
      lessonsCompleted: snapshot.lessonsCompleted,
      assignmentsCompleted: snapshot.assignmentsCompleted,
      totalPoints: snapshot.totalPoints,
    })) 
    : [];
  
  // Format popular courses for bar chart
  const coursesData = popularCourses ? 
    popularCourses.map((item: CourseAnalytic) => ({
      name: item.course.title.length > 15 ? 
        item.course.title.substring(0, 15) + '...' : 
        item.course.title,
      enrollments: item.totalEnrollments,
      completionRate: item.completionRate,
    })) 
    : [];

  if (user?.role !== "admin" && user?.role !== "instructor") {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Analytics dashboard is only available for instructors and administrators.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <DatePickerWithRange 
          date={dateRange} 
          setDate={setDateRange} 
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-activity">User Activity</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="platform">Platform Stats</TabsTrigger>
          )}
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses Enrolled
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].coursesEnrolled 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses Completed
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].coursesCompleted 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lessons Completed
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].lessonsCompleted 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Points Earned
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].totalPoints 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Distribution of user activities on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUserActivities ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {activityData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={ACTIVITY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-10 text-muted-foreground">
                    No activity data available
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>
                  Learning progress trends for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={progressData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="lessonsCompleted"
                        stroke="#0088FE"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="coursesCompleted" stroke="#00C49F" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-10 text-muted-foreground">
                    No progress data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* User Activity Tab */}
        <TabsContent value="user-activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activities</CardTitle>
              <CardDescription>
                Detailed log of user interactions with the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUserActivities ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : userActivities && userActivities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Action</th>
                        <th className="py-2 px-4 text-left">Resource</th>
                        <th className="py-2 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivities.map((activity: UserActivity, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4 capitalize">
                            {activity.action.replace(/_/g, ' ')}
                          </td>
                          <td className="py-2 px-4">
                            {activity.resourceType ? `${activity.resourceType} #${activity.resourceId}` : 'N/A'}
                          </td>
                          <td className="py-2 px-4">
                            {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No activity data available
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>
                Breakdown of activities by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUserActivities ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name.replace(/_/g, ' ')}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {activityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={ACTIVITY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No activity data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Over Time</CardTitle>
              <CardDescription>
                Track your progress across different learning metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUserProgress ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={progressData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="coursesCompleted"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="lessonsCompleted" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="assignmentsCompleted" stroke="#ffc658" />
                    <Line type="monotone" dataKey="totalPoints" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No progress data available for the selected period
                </p>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses Enrolled
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].coursesEnrolled 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses Completed
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].coursesCompleted 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lessons Completed
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].lessonsCompleted 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Badges Earned
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingUserProgress ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userProgress && userProgress.length > 0 
                      ? userProgress[userProgress.length - 1].badgesEarned 
                      : 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
              <CardDescription>
                Courses ranked by enrollment and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPopularCourses ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : coursesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={coursesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 100,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={70}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="enrollments" fill="#8884d8" name="Enrollments" />
                    <Bar yAxisId="right" dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No course analytics data available
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Course list with analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics Details</CardTitle>
              <CardDescription>
                Detailed analytics for each course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPopularCourses ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : popularCourses && popularCourses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Course</th>
                        <th className="py-2 px-4 text-left">Enrollments</th>
                        <th className="py-2 px-4 text-left">Completion Rate</th>
                        <th className="py-2 px-4 text-left">Average Rating</th>
                        <th className="py-2 px-4 text-left">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popularCourses.map((item: CourseAnalytic, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4 font-medium">{item.course.title}</td>
                          <td className="py-2 px-4">{item.totalEnrollments}</td>
                          <td className="py-2 px-4">{item.completionRate}%</td>
                          <td className="py-2 px-4">{item.averageRating || 'N/A'}</td>
                          <td className="py-2 px-4">{item.course.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No course analytics data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Platform Stats Tab (Admin Only) */}
        {user?.role === "admin" && (
          <TabsContent value="platform" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingPlatformStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {platformStats?.totalUsers || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Courses
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingPlatformStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {platformStats?.totalCourses || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lessons Completed
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingPlatformStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {platformStats?.totalLessonsCompleted || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Assignments Completed
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingPlatformStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {platformStats?.totalAssignmentsCompleted || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Grade
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingPlatformStats ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {platformStats?.averageGrade ? 
                        `${platformStats.averageGrade.toFixed(1)}%` : 
                        'N/A'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Usage Summary</CardTitle>
                <CardDescription>
                  This section provides aggregated statistics about the platform usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The e-learning platform currently has {platformStats?.totalUsers || 0} registered users who have access to {platformStats?.totalCourses || 0} courses. 
                  Users have completed a total of {platformStats?.totalLessonsCompleted || 0} lessons and submitted {platformStats?.totalAssignmentsCompleted || 0} assignments.
                  The average grade across all assignments is {platformStats?.averageGrade ? `${platformStats.averageGrade.toFixed(1)}%` : 'not available'}.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast({
                      title: "Report exported",
                      description: "The analytics report has been downloaded.",
                    });
                  }}
                >
                  Export Full Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}