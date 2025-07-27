import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCheck, Search, Calendar, CalendarClock } from "lucide-react";
import { Assignment } from "@shared/schema";

export default function Assignments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch assignments
  const { data: assignments = [], isLoading } = useQuery<(Assignment & { course: { title: string } })[]>({
    queryKey: ["/api/assignments"],
  });
  
  // Filter assignments based on search
  const filteredAssignments = assignments.filter(
    assignment => 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      assignment.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group assignments by due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const overdueAssignments = filteredAssignments.filter(
    a => a.dueDate && new Date(a.dueDate) < today
  );
  
  const dueTodayAssignments = filteredAssignments.filter(
    a => a.dueDate && 
       new Date(a.dueDate).getDate() === today.getDate() && 
       new Date(a.dueDate).getMonth() === today.getMonth() && 
       new Date(a.dueDate).getFullYear() === today.getFullYear()
  );
  
  const dueTomorrowAssignments = filteredAssignments.filter(
    a => a.dueDate && 
       new Date(a.dueDate).getDate() === tomorrow.getDate() && 
       new Date(a.dueDate).getMonth() === tomorrow.getMonth() && 
       new Date(a.dueDate).getFullYear() === tomorrow.getFullYear()
  );
  
  const dueThisWeekAssignments = filteredAssignments.filter(
    a => a.dueDate && 
       new Date(a.dueDate) > tomorrow && 
       new Date(a.dueDate) <= nextWeek
  );
  
  const laterAssignments = filteredAssignments.filter(
    a => !a.dueDate || new Date(a.dueDate) > nextWeek
  );
  
  // Assignment component
  const AssignmentItem = ({ assignment }: { assignment: Assignment & { course: { title: string } } }) => {
    return (
      <div className="flex items-center p-4 border-b border-neutral-100 hover:bg-neutral-50">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-neutral-900">{assignment.title}</h3>
          <p className="text-xs text-neutral-500">{assignment.course.title}</p>
        </div>
        <div className="ml-4 flex items-center">
          {assignment.dueDate && (
            <div className="flex items-center mr-4 text-xs text-neutral-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
          )}
          <Button variant="outline" size="sm">View</Button>
        </div>
      </div>
    );
  };
  
  // Assignment group component
  const AssignmentGroup = ({ title, assignments, icon }: { title: string, assignments: (Assignment & { course: { title: string } })[], icon: React.ReactNode }) => {
    if (assignments.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-3">
          {icon}
          <h2 className="text-lg font-semibold text-neutral-900 ml-2">{title}</h2>
          <span className="ml-2 text-sm text-neutral-500">({assignments.length})</span>
        </div>
        <Card>
          <CardContent className="p-0">
            {assignments.map(assignment => (
              <AssignmentItem key={assignment.id} assignment={assignment} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Assignments</h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Hey {user?.displayName?.split(' ')[0]}! Stay on top of your assignments - check due dates and submit your work on time.
                  </p>
                </div>
                
                {/* Search */}
                <div className="mt-4 md:mt-0 md:ml-4">
                  <div className="flex items-center relative">
                    <Input 
                      className="md:w-64 pl-10" 
                      placeholder="Search assignments..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="animate-pulse flex items-center">
                            <div className="rounded-full bg-neutral-200 h-10 w-10 mr-4"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-8 bg-neutral-200 rounded w-20"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileCheck className="h-12 w-12 mx-auto text-neutral-300" />
                      <h3 className="mt-4 text-lg font-medium">No assignments found</h3>
                      <p className="mt-1 text-neutral-500">You're all caught up or try a different search</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <AssignmentGroup 
                      title="Overdue" 
                      assignments={overdueAssignments} 
                      icon={<div className="w-6 h-6 rounded-full bg-error flex items-center justify-center"><FileText className="h-3 w-3 text-white" /></div>} 
                    />
                    
                    <AssignmentGroup 
                      title="Due Today" 
                      assignments={dueTodayAssignments} 
                      icon={<div className="w-6 h-6 rounded-full bg-error flex items-center justify-center"><CalendarClock className="h-3 w-3 text-white" /></div>} 
                    />
                    
                    <AssignmentGroup 
                      title="Due Tomorrow" 
                      assignments={dueTomorrowAssignments} 
                      icon={<div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center"><CalendarClock className="h-3 w-3 text-white" /></div>} 
                    />
                    
                    <AssignmentGroup 
                      title="Due This Week" 
                      assignments={dueThisWeekAssignments} 
                      icon={<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Calendar className="h-3 w-3 text-white" /></div>} 
                    />
                    
                    <AssignmentGroup 
                      title="Later" 
                      assignments={laterAssignments} 
                      icon={<div className="w-6 h-6 rounded-full bg-neutral-500 flex items-center justify-center"><Calendar className="h-3 w-3 text-white" /></div>} 
                    />
                  </>
                )}
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
