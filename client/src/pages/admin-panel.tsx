import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AddTurkishCourses } from "@/components/ui/add-turkish-courses";
import { CategoryManager } from "@/components/admin/category-manager";
import { CourseManager } from "@/components/admin/course-manager";
import { UserManager } from "@/components/admin/user-manager";
import { DatabaseManager } from "@/components/admin/database-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield, Settings, Database, Book, FolderTree, Users } from "lucide-react";
import { Redirect } from "wouter";

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  // Redirect if not an admin
  if (!user || user.role !== "admin") {
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
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Manage platform settings and content
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <Tabs defaultValue="courses">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="users">
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="courses">
                    <Book className="h-4 w-4 mr-2" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="categories">
                    <FolderTree className="h-4 w-4 mr-2" />
                    Categories
                  </TabsTrigger>
                  <TabsTrigger value="database">
                    <Database className="h-4 w-4 mr-2" />
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-6">
                  <UserManager />
                </TabsContent>
                
                
                <TabsContent value="courses" className="mt-6 space-y-6">
                  {/* Course Management */}
                  <CourseManager />
                  
                  {/* Add Turkish University Entrance Exam Courses */}
                  <AddTurkishCourses />
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                  <CategoryManager />
                </TabsContent>
                
                <TabsContent value="database" className="mt-6">
                  <DatabaseManager />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Settings</CardTitle>
                      <CardDescription>
                        Configure global platform settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Settings configuration features coming soon.
                      </p>
                    </CardContent>
                  </Card>
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