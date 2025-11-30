import { useQuery } from "@tanstack/react-query";
import { Assignment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, AlertCircle, CheckCircle2, ListTodo } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface ToDoListProps {
  courseId: number;
  showEmpty?: boolean;
}

export function ToDoList({ courseId, showEmpty = true }: ToDoListProps) {
  const { data: assignments = [] } = useQuery<Assignment[]>({
    queryKey: [`/api/courses/${courseId}/assignments`],
  });

  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());

  // Separate pending and completed
  const pendingAssignments = assignments.filter((a) => !completedIds.has(a.id) && a.status !== "completed");
  const completedAssignments = assignments.filter((a) => completedIds.has(a.id) || a.status === "completed");

  const toggleComplete = (id: number) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedIds(newCompleted);
  };

  if (assignments.length === 0 && showEmpty) {
    return (
      <Card data-testid="todo-empty" className="border-dashed">
        <CardContent className="pt-6 text-center">
          <ListTodo className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="font-semibold">You're all caught up!</p>
          <p className="text-sm text-muted-foreground">No pending assignments at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="todo-list">
      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <Card data-testid="pending-assignments">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                Pending Tasks ({pendingAssignments.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssignments.map((assignment) => {
              const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
              const daysUntilDue = assignment.dueDate
                ? Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <div
                  key={assignment.id}
                  className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${
                    isOverdue
                      ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                      : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:shadow-md"
                  }`}
                  data-testid={`todo-item-${assignment.id}`}
                >
                  <Checkbox
                    checked={completedIds.has(assignment.id)}
                    onCheckedChange={() => toggleComplete(assignment.id)}
                    className="mt-1"
                    data-testid={`todo-checkbox-${assignment.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" data-testid={`todo-title-${assignment.id}`}>
                      {assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1" data-testid={`todo-desc-${assignment.id}`}>
                      {assignment.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {assignment.dueDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span
                            className={`text-xs font-semibold ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}
                            data-testid={`todo-due-${assignment.id}`}
                          >
                            Due {format(new Date(assignment.dueDate), "MMM d")}
                            {daysUntilDue !== null && (
                              <span className="ml-1">
                                ({isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs"
                        data-testid={`todo-points-${assignment.id}`}
                      >
                        {assignment.points} pts
                      </Badge>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1" data-testid={`todo-overdue-${assignment.id}`}>
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <Card data-testid="completed-assignments" className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed ({completedAssignments.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-2 rounded flex items-start gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                data-testid={`completed-item-${assignment.id}`}
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-through" data-testid={`completed-title-${assignment.id}`}>
                    {assignment.title}
                  </p>
                  {assignment.dueDate && (
                    <p className="text-xs text-muted-foreground" data-testid={`completed-date-${assignment.id}`}>
                      Completed {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
