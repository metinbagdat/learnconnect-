import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
}

interface StudyPlan {
  id: number;
  title: string;
}

interface StudyTimelineProps {
  plan: StudyPlan;
  assignments: Assignment[];
  onPlanAdjust: () => void;
}

export function StudyTimeline({ plan, assignments, onPlanAdjust }: StudyTimelineProps) {
  const upcomingAssignments = assignments
    .filter(a => a.status !== "completed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Card className="col-span-1" data-testid="widget-study-timeline">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Study Timeline
          </CardTitle>
          <CardDescription>{plan?.title || "Your study plan"}</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={onPlanAdjust} data-testid="button-adjust-plan">
          Adjust Pace
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingAssignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming assignments</p>
        ) : (
          upcomingAssignments.map((assignment, idx) => (
            <div
              key={assignment.id}
              className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
              data-testid={`timeline-item-${assignment.id}`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{assignment.title}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant={assignment.status === "in_progress" ? "default" : "secondary"}
                className="text-xs shrink-0"
              >
                {assignment.status === "in_progress" ? "In Progress" : "Pending"}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
