import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AdminCurriculumGenerator() {
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("8");
  const [targetAudience, setTargetAudience] = useState("Intermediate learners");
  const [generatedCurriculum, setGeneratedCurriculum] = useState<any>(null);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/curriculum/generate", {
        courseTitle,
        courseDescription,
        durationWeeks: parseInt(durationWeeks),
        targetAudience,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedCurriculum(data.curriculum);
      toast({ title: "✓ Curriculum generated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({ title: "Failed to generate curriculum", variant: "destructive" });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Curriculum Generator
          </h1>
          <p className="text-muted-foreground">Create structured courses instantly with AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Provide course information for AI to generate curriculum</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  placeholder="e.g., Advanced Python Programming"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  data-testid="input-course-title"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Course Description</label>
                <Textarea
                  placeholder="Describe what students will learn..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="h-32"
                  data-testid="textarea-course-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (weeks)</label>
                  <Input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    min="1"
                    max="52"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    placeholder="e.g., Intermediate"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || !courseTitle || !courseDescription}
                className="w-full"
                data-testid="button-generate-curriculum"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Curriculum
              </Button>
            </CardContent>
          </Card>

          {/* Generated Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Generated Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedCurriculum ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Modules</p>
                    <p className="text-2xl font-bold">{generatedCurriculum.totalModules}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Lessons</p>
                    <p className="text-2xl font-bold">{generatedCurriculum.totalLessons}</p>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedCurriculum.modules?.map((m: any, idx: number) => (
                      <div key={idx} className="p-2 bg-purple-50 dark:bg-purple-900 rounded">
                        <p className="font-semibold text-sm">{m.module?.title}</p>
                        <p className="text-xs text-muted-foreground">{m.lessons?.length} lessons</p>
                      </div>
                    ))}
                  </div>
                  <Badge className="bg-green-600">✓ Saved</Badge>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Generate curriculum to see structure here</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
