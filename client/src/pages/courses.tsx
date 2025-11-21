import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CourseTree } from "@/components/ui/course-tree";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/components/error-states/api-error";
import { EmptyState } from "@/components/error-states/empty-state";
import { CourseCardSkeleton } from "@/components/loading-states/enhanced-skeleton";
import { Search } from "lucide-react";
import { Course } from "@shared/schema";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Courses() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch hierarchical user courses
  const { data: userCoursesTree = [], isLoading: userCoursesLoading, error: userCoursesError, refetch: refetchUserCourses } = useQuery<any[]>({
    queryKey: ["/api/user/courses/tree"],
  });
  
  // Fetch hierarchical all courses
  const { data: allCoursesTree = [], isLoading: allCoursesLoading, error: allCoursesError, refetch: refetchAllCourses } = useQuery<any[]>({
    queryKey: ["/api/courses/tree"],
  });
  
  // Helper function to filter tree based on search query
  const filterCourseTree = (courses: any[], query: string): any[] => {
    if (!query) return courses;
    
    return courses.reduce((acc: any[], course: any) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(query.toLowerCase()) || 
        course.category.toLowerCase().includes(query.toLowerCase());
      
      const filteredChildren = course.children ? filterCourseTree(course.children, query) : [];
      
      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...course,
          children: filteredChildren
        });
      }
      
      return acc;
    }, []);
  };
  
  // Helper function to remove already-enrolled courses from available courses
  const removeEnrolledCourses = (courses: any[], enrolledTree: any[]): any[] => {
    // Create set of all enrolled course IDs
    const enrolledIds = new Set<number>();
    const collectEnrolledIds = (courses: any[]) => {
      courses.forEach(course => {
        if (course.isEnrolled) {
          enrolledIds.add(course.id);
        }
        if (course.children) {
          collectEnrolledIds(course.children);
        }
      });
    };
    collectEnrolledIds(enrolledTree);
    
    // Filter out enrolled courses, keeping structure
    return courses.reduce((acc: any[], course: any) => {
      if (enrolledIds.has(course.id)) {
        return acc; // Skip already enrolled courses
      }
      
      const filteredChildren = course.children ? removeEnrolledCourses(course.children, enrolledTree) : [];
      
      acc.push({
        ...course,
        children: filteredChildren
      });
      
      return acc;
    }, []);
  };
  
  const filteredUserCourses = filterCourseTree(userCoursesTree, searchQuery);
  const availableCoursesFiltered = removeEnrolledCourses(allCoursesTree, userCoursesTree);
  const filteredAvailableCourses = filterCourseTree(availableCoursesFiltered, searchQuery);
  
  // Handle course enrollment
  const enrollInCourse = async (courseId: number) => {
    if (!user) return;
    
    try {
      await apiRequest("POST", "/api/user/courses", { courseId });
      toast({
        title: t('enrollmentSuccessful'),
        description: t('enrollmentSuccessDescription'),
      });
      // Invalidate both hierarchical cache keys to update UI
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses/tree"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses/tree"] });
    } catch (error) {
      toast({
        title: t('enrollmentFailed'),
        description: t('enrollmentFailedDescription'),
        variant: "destructive",
      });
    }
  };
  
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
                  <h1 className="text-2xl font-bold text-neutral-900">{t('myCourses')}</h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Hey {user?.displayName?.split(' ')[0]}! Here are your courses - continue learning, explore new topics, or track your progress.
                  </p>
                </div>
                
                {/* Search */}
                <div className="mt-4 md:mt-0 md:ml-4">
                  <div className="flex items-center relative">
                    <Input 
                      className="md:w-64 pl-10" 
                      placeholder={t('searchPlaceholder')} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <Tabs defaultValue="enrolled">
                <TabsList>
                  <TabsTrigger value="enrolled">{t('myCourses')}</TabsTrigger>
                  <TabsTrigger value="available">{t('availableCourses')}</TabsTrigger>
                </TabsList>
                
                {/* Enrolled Courses Tab - Hierarchical Tree View */}
                <TabsContent value="enrolled" className="mt-6">
                  {userCoursesError ? (
                    <ApiError 
                      error={userCoursesError}
                      onRetry={refetchUserCourses}
                      type="network"
                      title={t('failedToLoadCourses', 'Failed to load your courses')}
                      description={t('coursesErrorDesc', 'Unable to load your enrolled courses. Please check your connection and try again.')}
                    />
                  ) : userCoursesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <CourseCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : filteredUserCourses.length === 0 ? (
                    <EmptyState 
                      type={searchQuery ? "search" : "courses"}
                      onAction={() => searchQuery ? setSearchQuery("") : navigate('/courses')}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          Your courses are organized in a hierarchical structure. Click to expand and explore sub-courses.
                        </p>
                      </div>
                      <CourseTree courses={filteredUserCourses} />
                    </div>
                  )}
                </TabsContent>
                
                {/* Available Courses Tab - Hierarchical Tree View */}
                <TabsContent value="available" className="mt-6">
                  {allCoursesError ? (
                    <ApiError 
                      error={allCoursesError}
                      onRetry={refetchAllCourses}
                      type="server"
                      title={t('failedToLoadCourses', 'Failed to load available courses')}
                      description={t('coursesErrorDesc', 'Unable to load available courses. Please try again.')}
                    />
                  ) : allCoursesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <CourseCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : filteredAvailableCourses.length === 0 ? (
                    <EmptyState 
                      type={searchQuery ? "search" : "courses"}
                      onAction={() => searchQuery ? setSearchQuery("") : navigate('/courses')}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          Browse available courses organized by curriculum structure. Enroll in any course to begin learning.
                        </p>
                      </div>
                      <CourseTree 
                        courses={filteredAvailableCourses} 
                        showEnrollButton={true}
                        onEnroll={enrollInCourse}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
