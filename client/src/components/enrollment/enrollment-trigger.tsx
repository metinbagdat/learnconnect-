import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level?: string;
  durationHours?: number;
}

interface EnrollmentTriggerProps {
  course: Course;
  onEnrollmentComplete?: (result: any) => void;
}

export function EnrollmentTrigger({ course, onEnrollmentComplete }: EnrollmentTriggerProps) {
  const { toast } = useToast();

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/pipeline/enroll-and-generate", {
        courseId: course.id,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✓ Enrollment completed!",
        description: "Your study plan and assignments have been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      onEnrollmentComplete?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <Card data-testid="enrollment-trigger" className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {course.title}
            </CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="grid grid-cols-3 gap-2 text-sm" data-testid="course-info">
          <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded" data-testid="info-category">
            <p className="text-muted-foreground text-xs">Category</p>
            <p className="font-semibold">{course.category}</p>
          </div>
          <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded" data-testid="info-level">
            <p className="text-muted-foreground text-xs">Level</p>
            <p className="font-semibold">{course.level || "All"}</p>
          </div>
          <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded" data-testid="info-duration">
            <p className="text-muted-foreground text-xs">Duration</p>
            <p className="font-semibold">{course.durationHours || 30}h</p>
          </div>
        </div>

        {/* Pipeline Info */}
        <div
          className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2"
          data-testid="pipeline-info"
        >
          <p className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Automated 5-Step Pipeline
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground pl-6">
            <li data-testid="step-1">✓ Validate & Create enrollment</li>
            <li data-testid="step-2">✓ Generate AI curriculum</li>
            <li data-testid="step-3">✓ Create 30-day study plan</li>
            <li data-testid="step-4">✓ Generate assignments with cumulative due dates</li>
            <li data-testid="step-5">✓ Send welcome notifications</li>
          </ul>
        </div>

        {/* Loading Progress */}
        {enrollMutation.isPending && (
          <div className="space-y-2" data-testid="enrollment-progress">
            <p className="text-sm font-semibold">Processing enrollment...</p>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground">
              This may take 30-60 seconds as we generate your personalized curriculum
            </p>
          </div>
        )}

        {/* Enroll Button */}
        <Button
          onClick={() => enrollMutation.mutate()}
          disabled={enrollMutation.isPending}
          className="w-full"
          size="lg"
          data-testid="button-enroll"
        >
          {enrollMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enrolling and Generating Plan...
            </>
          ) : (
            <>
              Enroll Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Success Message */}
        {enrollMutation.isSuccess && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg" data-testid="enrollment-success">
            <p className="text-sm font-semibold text-green-700 dark:text-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Successfully enrolled!
            </p>
            <p className="text-xs text-green-600 dark:text-green-200 mt-1">
              Your personalized study plan is ready. Check your dashboard to get started!
            </p>
          </div>
        )}

        {/* Error Message */}
        {enrollMutation.isError && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg" data-testid="enrollment-error">
            <p className="text-sm font-semibold text-red-700 dark:text-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Enrollment failed
            </p>
            <p className="text-xs text-red-600 dark:text-red-200 mt-1">
              Please try again or contact support
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
