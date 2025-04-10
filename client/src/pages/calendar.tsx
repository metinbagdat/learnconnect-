import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Assignment } from "@shared/schema";
import { Sidebar } from "@/components/layout/sidebar";
import { Bell, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Fetch assignments to display on calendar
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery<(Assignment & { course: { title: string } })[]>({
    queryKey: ["/api/assignments"],
  });

  // Group assignments by due date
  const assignmentsByDate = assignments.reduce((acc, assignment) => {
    if (!assignment.dueDate) return acc;
    
    const dueDate = new Date(assignment.dueDate);
    const dateKey = format(dueDate, "yyyy-MM-dd");
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(assignment);
    return acc;
  }, {} as Record<string, (Assignment & { course: { title: string } })[]>);

  // Current selected date's assignments
  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";
  const selectedDateAssignments = assignmentsByDate[selectedDateKey] || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        </div>
        
        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>View and manage your schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                    // Highlight dates with assignments
                    modifiers={{
                      hasAssignment: Object.keys(assignmentsByDate).map(dateStr => new Date(dateStr))
                    }}
                    modifiersClassNames={{
                      hasAssignment: "border-2 border-primary font-bold text-primary"
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateAssignments.length 
                      ? `${selectedDateAssignments.length} assignments due` 
                      : "No assignments due on this date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateAssignments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Course: {assignment.course.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {format(new Date(assignment.dueDate!), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
                      <h3 className="text-lg font-medium">No assignments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        There are no assignments due on this date.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Upcoming Assignments
                </CardTitle>
                <CardDescription>All assignments due in the next 2 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="text-center py-6">Loading assignments...</div>
                ) : assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments
                      .filter(a => a.dueDate && new Date(a.dueDate) >= new Date())
                      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                      .slice(0, 10)
                      .map((assignment) => (
                        <div key={assignment.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Course: {assignment.course.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary">
                              {format(new Date(assignment.dueDate!), "MMM d")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(assignment.dueDate!), "h:mm a")}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming assignments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}