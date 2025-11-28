import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Clock } from "lucide-react";

interface ProgressWidgetProps {
  currentCourse: {
    id: number;
    title: string;
    description: string;
  };
  completionPercentage: number;
  nextAssignment: {
    id: number;
    title: string;
    dueDate: string;
  } | null;
}

export function ProgressWidget({ currentCourse, completionPercentage, nextAssignment }: ProgressWidgetProps) {
  return (
    <Card className="col-span-1" data-testid="widget-progress">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Current Course
        </CardTitle>
        <CardDescription>{currentCourse?.title || "No course selected"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-lg">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" data-testid="progress-bar-completion" />
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
          <p className="text-sm font-semibold">Next Assignment</p>
          {nextAssignment ? (
            <>
              <p className="text-sm text-muted-foreground">{nextAssignment.title}</p>
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <Clock className="w-3 h-3" />
                Due: {new Date(nextAssignment.dueDate).toLocaleDateString()}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No upcoming assignments</p>
          )}
        </div>

        <Badge className="bg-green-600">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          On Track
        </Badge>
      </CardContent>
    </Card>
  );
}
