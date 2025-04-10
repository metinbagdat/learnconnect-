import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AICourseGenerator } from "@/components/ui/ai-course-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Sparkles, Brain, Bot } from "lucide-react";
import { Redirect } from "wouter";

export default function CourseGenerator() {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  // Redirect if not an instructor or admin
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-neutral-900">AI Course Generator</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Create comprehensive courses powered by AI
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Generator Form */}
                <div className="md:col-span-2">
                  <AICourseGenerator />
                </div>
                
                {/* Info Panel */}
                <div className="md:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-primary" />
                        How It Works
                      </CardTitle>
                      <CardDescription>
                        Generate AI-powered courses in seconds
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">Complete Course Structure</h3>
                          <p className="text-sm text-muted-foreground">
                            AI generates a full course with modules and lessons based on your topic
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">Customized Learning Path</h3>
                          <p className="text-sm text-muted-foreground">
                            Specify difficulty level and target audience for personalized content
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium">AI Learning Assistant</h3>
                          <p className="text-sm text-muted-foreground">
                            Each course includes intelligent support for students' questions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Tips for Better Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Be specific about your topic</li>
                        <li>• Include the target audience's background</li>
                        <li>• Specify any particular skills to be taught</li>
                        <li>• Mention specific technologies or frameworks</li>
                        <li>• Include desired learning outcomes</li>
                      </ul>
                    </CardContent>
                  </Card>
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