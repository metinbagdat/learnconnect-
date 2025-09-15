import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  MessageSquare,
  Calendar,
  Target,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle,
  UserCheck
} from "lucide-react";

interface Student {
  id: number;
  displayName: string;
  username: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  averageGrade: number;
  lastActivity: string;
  currentStreak: number;
  totalStudyHours: number;
}

interface MentorStats {
  totalStudents: number;
  activeStudents: number;
  averageGrade: number;
  totalHoursThisWeek: number;
  completionRate: number;
}

export default function MentorControlPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mentor's students
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ['/api/mentor/students'],
  });

  // Fetch mentor statistics
  const { data: mentorStats, isLoading: statsLoading } = useQuery<MentorStats>({
    queryKey: ['/api/mentor/stats'],
  });

  // Fetch recent student activities
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/mentor/recent-activities'],
  });

  // Send message to student
  const sendMessageMutation = useMutation({
    mutationFn: async ({ studentId, message }: { studentId: number; message: string }) => {
      const res = await apiRequest("POST", `/api/mentor/students/${studentId}/message`, { message });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('messageSent', 'Message Sent'),
        description: t('messagesSentSuccessfully', 'Your message has been sent to the student.'),
      });
    },
    onError: () => {
      toast({
        title: t('error', 'Error'),
        description: t('failedToSendMessage', 'Failed to send message. Please try again.'),
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (studentId: number, message: string) => {
    if (message.trim()) {
      sendMessageMutation.mutate({ studentId, message });
    }
  };

  const getProgressColor = (grade: number) => {
    if (grade >= 80) return "text-green-600";
    if (grade >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getActivityStatus = (lastActivity: string) => {
    const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceActivity <= 1) return { status: "active", color: "text-green-600" };
    if (daysSinceActivity <= 7) return { status: "moderate", color: "text-yellow-600" };
    return { status: "inactive", color: "text-red-600" };
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('mentorControlPanel', 'Mentor Control Panel')}</h1>
          <p className="text-muted-foreground">
            {t('trackAndGuideYourStudents', 'Track and guide your students\' learning progress')}
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <UserCheck className="h-4 w-4 mr-2" />
          {t('mentor', 'Mentor')}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('students', 'Students')}
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('activities', 'Activities')}
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('messaging', 'Messaging')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('totalStudents', 'Total Students')}
                    </p>
                    <p className="text-2xl font-bold">{mentorStats?.totalStudents || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('activeStudents', 'Active Students')}
                    </p>
                    <p className="text-2xl font-bold">{mentorStats?.activeStudents || 0}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('averageGrade', 'Average Grade')}
                    </p>
                    <p className="text-2xl font-bold">{mentorStats?.averageGrade || 0}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('weeklyStudyHours', 'Weekly Study Hours')}
                    </p>
                    <p className="text-2xl font-bold">{mentorStats?.totalHoursThisWeek || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('completionRate', 'Completion Rate')}
                    </p>
                    <p className="text-2xl font-bold">{mentorStats?.completionRate || 0}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('studentsNeedingAttention', 'Students Needing Attention')}</CardTitle>
                <CardDescription>
                  {t('studentsWithLowGradesOrInactivity', 'Students with low grades or recent inactivity')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .filter(student => student.averageGrade < 60 || new Date().getTime() - new Date(student.lastActivity).getTime() > 7 * 24 * 60 * 60 * 1000)
                    .slice(0, 5)
                    .map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{student.displayName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.averageGrade}% avg • {getActivityStatus(student.lastActivity).status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          {t('contact', 'Contact')}
                        </Button>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('topPerformers', 'Top Performers')}</CardTitle>
                <CardDescription>
                  {t('studentsWithHighGrades', 'Students excelling in their studies')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .sort((a, b) => b.averageGrade - a.averageGrade)
                    .slice(0, 5)
                    .map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{student.displayName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {student.averageGrade}% avg • {student.coursesCompleted} courses
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('allStudents', 'All Students')}</CardTitle>
              <CardDescription>
                {t('completeOverviewOfAllStudents', 'Complete overview of all your students and their progress')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('student', 'Student')}</TableHead>
                      <TableHead>{t('courses', 'Courses')}</TableHead>
                      <TableHead>{t('averageGrade', 'Avg Grade')}</TableHead>
                      <TableHead>{t('studyTime', 'Study Time')}</TableHead>
                      <TableHead>{t('streak', 'Streak')}</TableHead>
                      <TableHead>{t('lastActivity', 'Last Activity')}</TableHead>
                      <TableHead>{t('actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const activityStatus = getActivityStatus(student.lastActivity);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{student.displayName}</div>
                              <div className="text-sm text-muted-foreground">@{student.username}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.coursesCompleted}/{student.coursesEnrolled}
                          </TableCell>
                          <TableCell>
                            <span className={getProgressColor(student.averageGrade)}>
                              {student.averageGrade}%
                            </span>
                          </TableCell>
                          <TableCell>{student.totalStudyHours}h</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {student.currentStreak} {t('days', 'days')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={activityStatus.color}>
                              {new Date(student.lastActivity).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                                {t('view', 'View')}
                              </Button>
                              <Button size="sm" variant="outline">
                                {t('contact', 'Contact')}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivities', 'Recent Activities')}</CardTitle>
              <CardDescription>
                {t('latestStudentActivitiesAndProgress', 'Latest student activities and progress updates')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('noRecentActivities', 'No recent activities to display')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.studentName}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('sendMessage', 'Send Message to Student')}</CardTitle>
              <CardDescription>
                {t('communicateDirectlyWithYourStudents', 'Communicate directly with your students')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('selectStudent', 'Select Student')}</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const student = students.find(s => s.id === parseInt(e.target.value));
                        setSelectedStudent(student || null);
                      }}
                    >
                      <option value="">{t('chooseStudent', 'Choose a student...')}</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.displayName} (@{student.username})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedStudent && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">{t('messagingTo', 'Messaging to')}: {selectedStudent.displayName}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t('averageGrade', 'Avg Grade')}: </span>
                          <span className={getProgressColor(selectedStudent.averageGrade)}>
                            {selectedStudent.averageGrade}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('courses', 'Courses')}: </span>
                          {selectedStudent.coursesCompleted}/{selectedStudent.coursesEnrolled}
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('streak', 'Streak')}: </span>
                          {selectedStudent.currentStreak} {t('days', 'days')}
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('studyTime', 'Study Time')}: </span>
                          {selectedStudent.totalStudyHours}h
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('message', 'Message')}</label>
                      <textarea 
                        className="w-full p-3 border rounded-md h-32 resize-none"
                        placeholder={t('typeYourMessage', 'Type your message here...')}
                        id="messageInput"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          const messageInput = document.getElementById('messageInput') as HTMLTextAreaElement;
                          if (selectedStudent && messageInput.value.trim()) {
                            handleSendMessage(selectedStudent.id, messageInput.value);
                            messageInput.value = '';
                          }
                        }}
                        disabled={sendMessageMutation.isPending}
                      >
                        {sendMessageMutation.isPending ? t('sending', 'Sending...') : t('sendMessage', 'Send Message')}
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                        {t('cancel', 'Cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}