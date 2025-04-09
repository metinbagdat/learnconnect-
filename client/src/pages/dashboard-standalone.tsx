import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Book, CheckCircle, FileText, Award, Search } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/ui/course-card";
import { AIAssistant } from "@/components/ui/ai-assistant";
import { AssignmentList } from "@/components/ui/assignment-list";
import { Course, UserCourse, Assignment, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Sample data for the standalone dashboard
const sampleCourses: (UserCourse & { course: Course })[] = [
  {
    id: 1,
    userId: 1,
    courseId: 1,
    progress: 65,
    currentModule: 3,
    completed: false,
    enrolledAt: new Date(),
    course: {
      id: 1,
      title: "Introduction to JavaScript",
      description: "Learn the basics of JavaScript programming language.",
      instructorId: 1,
      category: "Programming",
      moduleCount: 10,
      durationHours: 25,
      rating: 4,
      imageUrl: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=JavaScript+Course"
    }
  },
  {
    id: 2,
    userId: 1,
    courseId: 2,
    progress: 30,
    currentModule: 2,
    completed: false,
    enrolledAt: new Date(),
    course: {
      id: 2,
      title: "Advanced React Development",
      description: "Master React with hooks, context and modern patterns.",
      instructorId: 2,
      category: "Web Development",
      moduleCount: 8,
      durationHours: 35,
      rating: 5,
      imageUrl: "https://placehold.co/600x400/14b8a6/FFFFFF/png?text=React+Course"
    }
  },
  {
    id: 3,
    userId: 1,
    courseId: 3,
    progress: 10,
    currentModule: 1,
    completed: false,
    enrolledAt: new Date(),
    course: {
      id: 3,
      title: "Database Design and SQL",
      description: "Learn relational database design and SQL queries.",
      instructorId: 3,
      category: "Database",
      moduleCount: 12,
      durationHours: 28,
      rating: 4,
      imageUrl: "https://placehold.co/600x400/a855f7/FFFFFF/png?text=SQL+Course"
    }
  }
];

const sampleAssignments: (Assignment & { course: Course })[] = [
  {
    id: 1,
    courseId: 1,
    title: "JavaScript Basics Quiz",
    description: "Test your knowledge of JavaScript fundamentals.",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    course: sampleCourses[0].course
  },
  {
    id: 2,
    courseId: 2,
    title: "Build a React Component",
    description: "Create a reusable React component with hooks.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    course: sampleCourses[1].course
  },
  {
    id: 3,
    courseId: 3,
    title: "Design a Database Schema",
    description: "Create an ERD for an e-commerce database.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    course: sampleCourses[2].course
  }
];

export default function DashboardStandalone() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Try to retrieve user data from localStorage
    const storedUser = localStorage.getItem('edulearn_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
        // If we can't parse the user data, go back to login
        navigate('/auth');
      }
    } else {
      // If no user data in localStorage, go back to login
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [navigate, toast]);
  
  // Use sample data for the standalone dashboard
  const userCourses = sampleCourses;
  const assignments = sampleAssignments;
  
  // Compute stats from the sample data
  const coursesInProgress = userCourses.filter(uc => !uc.completed).length;
  const completedCourses = userCourses.filter(uc => uc.completed).length;
  const pendingAssignments = assignments.length;
  const achievementsCount = 8; // Example fixed value
  
  // Get in-progress courses
  const inProgressCourses = userCourses
    .filter(uc => !uc.completed)
    .sort((a, b) => b.progress - a.progress);
  
  // Get upcoming assignments (limit to 3)
  const upcomingAssignments = assignments
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);
  
  // If user is not set yet, show a loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-neutral-100 flex items-center justify-between px-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 5.727 2.45a1 1 0 00.788 0l7-3a1 1 0 000-1.841l-7-3z"></path>
              <path d="M2.492 8.825l-.787.335c-.483.207-.795.712-.551 1.168.192.357.667.511 1.033.351l1.298-.558-.992-1.296zm10.665 2.31l-7.673 3.291c-.481.206-.796.71-.551 1.168.192.357.667.511 1.033.351l8.235-3.529c.392-.168.446-.707.098-.99-.27-.22-.67-.235-.968-.106l-.174.075v-.26z"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-neutral-900">EduLearn</span>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}</h1>
                  <p className="mt-1 text-sm text-neutral-600">Continue learning where you left off</p>
                </div>
                
                {/* Search */}
                <div className="mt-4 md:mt-0 md:ml-4">
                  <div className="flex items-center relative">
                    <Input 
                      className="md:w-64 pl-10" 
                      placeholder="Search courses, resources..." 
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  icon={Book} 
                  title="Courses in Progress" 
                  value={coursesInProgress} 
                  color="primary" 
                />
                
                <StatCard 
                  icon={CheckCircle} 
                  title="Completed Courses" 
                  value={completedCourses} 
                  color="success" 
                />
                
                <StatCard 
                  icon={FileText} 
                  title="Pending Assignments" 
                  value={pendingAssignments} 
                  color="warning" 
                />
                
                <StatCard 
                  icon={Award} 
                  title="Achievements" 
                  value={achievementsCount} 
                  color="secondary" 
                />
              </div>
            </div>
            
            {/* Continue Learning Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10">
              <h2 className="text-xl font-semibold text-neutral-900">Continue Learning</h2>
              
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {inProgressCourses.map((userCourse) => (
                  <CourseCard
                    key={userCourse.id}
                    course={userCourse.course}
                    userCourse={userCourse}
                    showContinue={true}
                    onContinue={() => navigate(`/courses/${userCourse.courseId}`)}
                  />
                ))}
              </div>
            </div>
            
            {/* Two-column layout for AI Assistant and Assignments */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Assistant */}
              <div className="md:col-span-2">
                <AIAssistant />
              </div>
              
              {/* Assignments */}
              <div>
                <AssignmentList 
                  assignments={upcomingAssignments}
                  onViewAll={() => navigate('/assignments')}
                  onViewAssignment={(id) => navigate(`/assignments/${id}`)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}