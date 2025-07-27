import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CourseCard } from "@/components/ui/course-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Course, UserCourse } from "@shared/schema";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Courses() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user courses
  const { data: userCourses = [], isLoading: userCoursesLoading } = useQuery<(UserCourse & { course: Course })[]>({
    queryKey: ["/api/user/courses"],
  });
  
  // Fetch all available courses
  const { data: allCourses = [], isLoading: allCoursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });
  
  // Filter courses that the user is not enrolled in
  const availableCourses = allCourses.filter(
    course => !userCourses.some(uc => uc.courseId === course.id)
  );
  
  // Filter courses based on search query
  const filteredUserCourses = userCourses.filter(
    uc => uc.course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          uc.course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAvailableCourses = availableCourses.filter(
    course => course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Split user courses into in-progress and completed
  const inProgressCourses = filteredUserCourses.filter(uc => !uc.completed);
  const completedCourses = filteredUserCourses.filter(uc => uc.completed);
  
  // Handle course enrollment
  const enrollInCourse = async (courseId: number) => {
    if (!user) return;
    
    try {
      await apiRequest("POST", "/api/user/courses", { courseId });
      toast({
        title: t('enrollmentSuccessful'),
        description: t('enrollmentSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
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
                  <p className="mt-1 text-sm text-neutral-600">{t('manageLearningJourney')}</p>
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
                
                {/* Enrolled Courses Tab */}
                <TabsContent value="enrolled" className="mt-6">
                  {userCoursesLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow h-64 animate-pulse">
                          <div className="h-40 bg-neutral-200 rounded-t-lg"></div>
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-200 rounded w-full"></div>
                            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredUserCourses.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                      <h3 className="text-lg font-medium">{t('noCoursesFound')}</h3>
                      <p className="mt-1 text-neutral-500">{searchQuery ? t('noCourseMatches') : t('noCoursesFoundDescription')}</p>
                    </div>
                  ) : (
                    <>
                      {/* In Progress Courses */}
                      {inProgressCourses.length > 0 && (
                        <>
                          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t('inProgress')}</h2>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
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
                        </>
                      )}
                      
                      {/* Completed Courses */}
                      {completedCourses.length > 0 && (
                        <>
                          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t('completed')}</h2>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {completedCourses.map((userCourse) => (
                              <CourseCard
                                key={userCourse.id}
                                course={userCourse.course}
                                userCourse={userCourse}
                                showContinue={false}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </TabsContent>
                
                {/* Available Courses Tab */}
                <TabsContent value="available" className="mt-6">
                  {allCoursesLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow h-64 animate-pulse">
                          <div className="h-40 bg-neutral-200 rounded-t-lg"></div>
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-200 rounded w-full"></div>
                            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredAvailableCourses.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                      <h3 className="text-lg font-medium">{searchQuery ? t('noCourseMatches') : t('noAvailableCourses')}</h3>
                      <p className="mt-1 text-neutral-500">{searchQuery ? t('tryDifferentSearch') : t('checkBackLater')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredAvailableCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          showEnroll={true}
                          onEnroll={() => enrollInCourse(course.id)}
                        />
                      ))}
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
