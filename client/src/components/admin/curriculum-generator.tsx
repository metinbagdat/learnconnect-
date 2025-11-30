import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, BookOpen, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CurriculumGenerator() {
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Generate curriculum mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const courseId = parseInt(selectedCourseId);
      const selectedCourse = courses.find((c) => c.id === courseId);
      if (!selectedCourse) throw new Error("Course not found");

      setGenerationProgress(10);

      const res = await apiRequest("POST", "/api/admin/curriculum/generate", {
        courseId,
        courseTitle: selectedCourse.title,
        courseDescription: courseDescription || selectedCourse.description,
      });

      if (!res.ok) throw new Error("Failed to generate curriculum");

      setGenerationProgress(100);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✓ Curriculum Generated!",
        description: `Generated ${data.modulesCount || 0} modules with lessons and study materials.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setGenerationProgress(0);
      setSelectedCourseId("");
      setCourseDescription("");
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Could not generate curriculum. Try again later.",
        variant: "destructive",
      });
      setGenerationProgress(0);
    },
  });

  const handleGenerate = () => {
    if (!selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  const selectedCourse = courses.find((c) => c.id === parseInt(selectedCourseId));

  return (
    <Card data-testid="curriculum-generator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          AI Curriculum Generator
        </CardTitle>
        <CardDescription>Generate comprehensive curriculum using AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Selection */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            Select Course
          </Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger data-testid="select-course">
              <SelectValue placeholder="Choose a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()} data-testid={`option-${course.id}`}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Description */}
        {selectedCourse && (
          <div>
            <Label htmlFor="description" className="mb-2 block">
              Course Description (Optional - leave blank to use existing)
            </Label>
            <Textarea
              id="description"
              placeholder={selectedCourse.description}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              rows={4}
              data-testid="textarea-description"
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {selectedCourse.description?.substring(0, 100)}...
            </p>
          </div>
        )}

        {/* What will be generated */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold mb-3">The AI will generate:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2" data-testid="feature-modules">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>4-5 comprehensive modules</span>
            </li>
            <li className="flex items-center gap-2" data-testid="feature-lessons">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>3-4 lessons per module</span>
            </li>
            <li className="flex items-center gap-2" data-testid="feature-concepts">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Key concepts & learning objectives</span>
            </li>
            <li className="flex items-center gap-2" data-testid="feature-problems">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Study problems & exercises</span>
            </li>
            <li className="flex items-center gap-2" data-testid="feature-timetable">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Personalized study timetable</span>
            </li>
            <li className="flex items-center gap-2" data-testid="feature-tips">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Study tips & review help</span>
            </li>
          </ul>
        </div>

        {/* Generation Progress */}
        {generationProgress > 0 && generationProgress < 100 && (
          <div className="space-y-2" data-testid="progress-section">
            <p className="text-sm font-semibold">Generating curriculum...</p>
            <Progress value={generationProgress} className="h-2" data-testid="progress-bar" />
            <p className="text-xs text-muted-foreground">This may take 30-60 seconds</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!selectedCourseId || generateMutation.isPending}
          className="w-full"
          size="lg"
          data-testid="button-generate"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Curriculum...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Curriculum with AI
            </>
          )}
        </Button>

        {/* Success Message */}
        {generationProgress === 100 && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800" data-testid="success-message">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Curriculum generated successfully!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
