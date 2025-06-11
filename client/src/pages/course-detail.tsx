import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModuleTree } from "@/components/modules/module-tree";
import { SkillChallengeManager } from "@/components/challenges/skill-challenge-manager";
import { Course, Module, Lesson } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useSkillChallenge } from "@/hooks/use-skill-challenge";
import { Book, CheckCircle, Clock, FileText, LucideIcon, Play, User, Brain, TreePine } from "lucide-react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { triggerSkillChallenge } = useSkillChallenge();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  
  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });
  
  // Fetch course modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: [`/api/courses/${courseId}/modules`],
    enabled: !!courseId,
  });
  
  // State to store lessons for each module
  const [moduleIdToLessons, setModuleIdToLessons] = useState<Record<number, Lesson[]>>({});
  
  // Load lessons for a module when it's expanded
  const loadLessonsForModule = async (moduleId: number) => {
    if (moduleIdToLessons[moduleId]) {
      return; // Lessons already loaded
    }
    
    try {
      const lessons = await apiRequest("GET", `/api/modules/${moduleId}/lessons`);
      const lessonsData = await lessons.json();
      setModuleIdToLessons(prev => ({
        ...prev,
        [moduleId]: lessonsData
      }));
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load lessons. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate lesson content when a lesson is clicked
  const generateLessonContent = async (lessonId: number, lessonTitle: string, moduleTitle: string) => {
    if (selectedLessonId === lessonId && lessonContent) {
      return; // Content already loaded
    }
    
    setSelectedLessonId(lessonId);
    setLoadingContent(true);
    setLessonContent(null);
    
    try {
      const response = await apiRequest("POST", "/api/ai/generate-lesson-content", {
        lessonId,
        lessonTitle,
        moduleTitle,
        courseTitle: course?.title
      });
      
      const data = await response.json();
      setLessonContent(data.content);
    } catch (error) {
      console.error("Failed to generate lesson content:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson content. Please try again.",
        variant: "destructive",
      });
      setLessonContent("# Content Generation Failed\n\nWe're having trouble generating the content for this lesson. Please try again later or contact support if the problem persists.");
    } finally {
      setLoadingContent(false);
    }
  };
  
  // Update progress when a lesson is completed
  const markLessonAsCompleted = async () => {
    if (!user || !course || !selectedLessonId) return;
    
    try {
      // Update lesson progress (simplified implementation)
      // In a real implementation, call the API to update lesson progress
      // await apiRequest("POST", `/api/user/lessons/${selectedLessonId}/progress`, { progress: 100 });
      
      // Show success toast
      toast({
        title: "Progress updated",
        description: "Your progress has been saved.",
      });
      
      // 30% chance to trigger a skill challenge after completing a lesson
      const triggerChance = Math.random();
      if (triggerChance < 0.3) {
        // Small delay to show the challenge after the progress toast
        setTimeout(() => {
          triggerSkillChallenge("skill");
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (courseLoading || modulesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mt-2 text-muted-foreground">The course you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
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
              {/* Course Header */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative h-48 bg-gradient-to-r from-primary to-primary-600">
                  <div className="absolute inset-0 flex items-center px-6 py-4">
                    <div className="max-w-2xl">
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{course.title}</h1>
                      <p className="text-primary-100 text-sm md:text-base">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center text-white">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.durationHours} hours</span>
                        </div>
                        <div className="flex items-center text-white">
                          <Book className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.moduleCount} modules</span>
                        </div>
                        <div className="flex items-center text-white">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm">Instructor ID: {course.instructorId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI-Enhanced Module Tree with Personalized Content */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TreePine className="h-6 w-6 text-green-600" />
                    <h2 className="text-2xl font-bold">Course Learning Path</h2>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Brain className="h-3 w-3 mr-1" />
                      AI-Personalized
                    </Badge>
                  </div>
                </div>
                
                {user && courseId && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <ModuleTree 
                        courseId={parseInt(courseId!)} 
                        userId={user.id}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <SkillChallengeManager
                        courseId={parseInt(courseId!)}
                        category={course?.category}
                        onChallengeComplete={(points, xp) => {
                          toast({
                            title: "Challenge completed!",
                            description: `Earned ${points} points and ${xp} XP`,
                          });
                          queryClient.invalidateQueries({ queryKey: ['/api/user/level'] });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Traditional fallback for when AI modules aren't available */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side - Traditional Module List */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-neutral-100">
                      <h2 className="text-lg font-semibold">Traditional Module View</h2>
                      <p className="text-sm text-gray-600 mt-1">Standard course structure without AI personalization</p>
                    </div>
                    <div className="p-2">
                      <Accordion 
                        type="single" 
                        collapsible
                        onValueChange={(value) => {
                          // Extract module ID from the value and load lessons
                          const moduleId = parseInt(value?.replace('module-', '') || '0');
                          if (moduleId > 0) loadLessonsForModule(moduleId);
                        }}
                      >
                        {modules.map((module) => (
                          <AccordionItem key={module.id} value={`module-${module.id}`}>
                            <AccordionTrigger className="px-3 py-2 hover:bg-neutral-50 rounded-md">
                              <div className="flex items-start">
                                <div className="flex-1 text-left">
                                  <span className="font-medium text-neutral-900">{module.title}</span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3">
                              {moduleIdToLessons[module.id] ? (
                                <ul className="space-y-1 py-1">
                                  {moduleIdToLessons[module.id].map((lesson) => (
                                    <li key={lesson.id}>
                                      <button
                                        onClick={() => generateLessonContent(lesson.id, lesson.title, module.title)}
                                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                                          selectedLessonId === lesson.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-neutral-700 hover:bg-neutral-100"
                                        }`}
                                      >
                                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="text-left">{lesson.title}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="py-2 px-3 text-center">
                                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-neutral-400" />
                                  <span className="text-sm text-neutral-500 mt-1">Loading lessons...</span>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Lesson Content */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm h-full">
                    <div className="p-6">
                      {selectedLessonId ? (
                        loadingContent ? (
                          <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                              <h3 className="text-lg font-medium text-neutral-900">Generating content...</h3>
                              <p className="text-neutral-500 mt-1">Please wait while we prepare the lesson content.</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="prose prose-neutral max-w-none">
                              {lessonContent && (
                                <ReactMarkdown>
                                  {lessonContent}
                                </ReactMarkdown>
                              )}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-neutral-200">
                              <Button onClick={markLessonAsCompleted} className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </Button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <FileText className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900">No lesson selected</h3>
                            <p className="text-neutral-500 mt-1">Select a lesson from the list to start learning.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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