import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
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
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";
import { 
  Loader2, 
  Calendar, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Activity,
  Brain,
  Target,
  Zap,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw
} from "lucide-react";
import { format, subDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";

interface DateRange {
  from?: Date;
  to?: Date;
}

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

interface EngagementMetrics {
  totalActivities: number;
  uniqueDaysActive: number;
  avgActivitiesPerDay: number;
  dailyBreakdown: Array<{ date: string; activities: number }>;
  activityTypes: Array<{ type: string; count: number; percentage: number }>;
}

interface LearningInsights {
  completionRate: number;
  completedCourses: number;
  inProgressCourses: number;
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  achievementsUnlocked: number;
  activeLearningDays: Array<{ date: string; active: boolean }>;
  strengthAreas: Array<{ area: string; score: number }>;
  recommendedFocus: Array<{ topic: string; priority: number; reason: string }>;
}

interface PerformanceTrends {
  velocity: { current: number; previous: number; change: number };
  summary: string;
  trends: Array<{ metric: string; trend: 'up' | 'down' | 'stable'; change: number }>;
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
  const { language, t } = useLanguage();
  const [dateRange, setDateRange] = useState<DateRange>({
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

  // Enhanced analytics data
  const { data: engagementMetrics, isLoading: loadingEngagement } = useQuery<EngagementMetrics>({
    queryKey: ["/api/analytics/engagement-metrics", { 
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString()
    }],
    enabled: Boolean(dateRange.from && dateRange.to)
  });

  const { data: learningInsights, isLoading: loadingInsights } = useQuery<LearningInsights>({
    queryKey: ["/api/analytics/learning-insights"]
  });

  const { data: performanceTrends, isLoading: loadingTrends } = useQuery<PerformanceTrends>({
    queryKey: ["/api/analytics/performance-trends", { days: 30 }]
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
        <h1 className="text-3xl font-bold mb-6">
          {language === 'tr' ? 'Analiz Panosu' : 'Analytics Dashboard'}
        </h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>
            {language === 'tr' 
              ? 'Analiz panosu sadece eğitmenler ve yöneticiler için kullanılabilir.'
              : 'Analytics dashboard is only available for instructors and administrators.'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'tr' ? 'Analiz Panosu' : 'Analytics Dashboard'}
        </h1>
        <DatePickerWithRange 
          date={dateRange} 
          setDate={(date: DateRange) => setDateRange(date)}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {language === 'tr' ? 'Genel Bakış' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {language === 'tr' ? 'Katılım' : 'Engagement'}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            {language === 'tr' ? 'İçgörüler' : 'Insights'}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'tr' ? 'Trendler' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {language === 'tr' ? 'Kurslar' : 'Courses'}
          </TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {language === 'tr' ? 'Platform' : 'Platform'}
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'tr' ? 'Toplam Kayıtlı Kurs' : 'Total Courses Enrolled'}
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

        {/* Engagement Metrics Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {engagementMetrics?.totalActivities || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Platform interactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {engagementMetrics?.uniqueDaysActive || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Days with learning activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {engagementMetrics?.avgActivitiesPerDay || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Activities per active day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    {engagementMetrics ? Math.min(100, Math.round(engagementMetrics.avgActivitiesPerDay * 10)) : 0}%
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Overall engagement level
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Breakdown</CardTitle>
                <CardDescription>Your learning activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : engagementMetrics?.dailyBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={engagementMetrics.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                      />
                      <Area
                        type="monotone"
                        dataKey="activities"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No activity data available for selected period
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Types Distribution</CardTitle>
                <CardDescription>Breakdown of different learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : engagementMetrics?.activityTypes ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(engagementMetrics.activityTypes).map(([name, value]) => ({
                          name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(engagementMetrics.activityTypes).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No activity type data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Learning Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Learning Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : learningInsights ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Course Completion</span>
                        <span>{learningInsights.completionRate}%</span>
                      </div>
                      <Progress value={learningInsights.completionRate} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {learningInsights.completedCourses}
                        </div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-500">
                          {learningInsights.inProgressCourses}
                        </div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Gamification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : learningInsights ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-500">
                        Level {learningInsights.currentLevel}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Level</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div>
                        <div className="font-bold text-blue-500">{learningInsights.totalXP}</div>
                        <div className="text-muted-foreground">Total XP</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-500">{learningInsights.currentStreak}</div>
                        <div className="text-muted-foreground">Day Streak</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary">
                        {learningInsights.achievementsUnlocked} Achievements Unlocked
                      </Badge>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Learning Consistency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Learning Consistency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : learningInsights ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {learningInsights.activeLearningDays}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Learning Days</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consistency Score</span>
                        <span>{Math.round((learningInsights.activeLearningDays / 30) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(learningInsights.activeLearningDays / 30) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="text-center">
                      <Badge variant={learningInsights.currentStreak > 7 ? "default" : "secondary"}>
                        {learningInsights.currentStreak > 7 ? "Great Streak!" : "Build Your Streak"}
                      </Badge>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Strength Areas and Recommendations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Strength Areas</CardTitle>
                <CardDescription>Topics you excel at</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : learningInsights?.strengthAreas ? (
                  <div className="flex flex-wrap gap-2">
                    {learningInsights.strengthAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {area}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Complete more courses to identify your strengths</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Focus</CardTitle>
                <CardDescription>Areas to work on next</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : learningInsights?.recommendedFocus ? (
                  <div className="space-y-2">
                    {learningInsights.recommendedFocus.map((recommendation, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Keep learning to get personalized recommendations</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Velocity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {performanceTrends?.velocity?.lessonsPerWeek || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lessons per week
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Points Growth</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-yellow-500">
                      +{performanceTrends?.summary?.totalGrowth?.points || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Points gained this month
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-500">
                      +{performanceTrends?.summary?.totalGrowth?.courses || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Courses completed this month
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
              <CardDescription>
                Your learning progress over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTrends ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : performanceTrends?.trends?.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceTrends.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="lessonsCompleted"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Lessons Completed"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalPoints"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Total Points"
                    />
                    <Line
                      type="monotone"
                      dataKey="coursesCompleted"
                      stroke="#ffc658"
                      strokeWidth={2}
                      name="Courses Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No performance data available yet. Complete some lessons to see your progress!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Course Analytics Tab */}
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