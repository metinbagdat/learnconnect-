import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Module } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssignmentGeneratorProps {
  courseId: number;
  moduleId?: number;
}

export function AssignmentGenerator({ courseId, moduleId }: AssignmentGeneratorProps) {
  const { toast } = useToast();
  const [selectedModuleId, setSelectedModuleId] = useState<string>(moduleId?.toString() || "");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [learningStyle, setLearningStyle] = useState<"visual" | "auditory" | "kinesthetic" | "reading">("visual");

  // Fetch modules for course
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: [`/api/courses/${courseId}/modules`],
  });

  // Generate assignment mutation
  const generateMutation = useMutation({
    mutationFn: async (data: {
      moduleId: number;
      difficulty: string;
      learningStyle: string;
    }) => {
      const response = await apiRequest("POST", "/api/assignments/generate", data);
      if (!response.ok) throw new Error("Failed to generate assignment");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      toast({
        title: "Success",
        description: `Assignment "${data.title}" generated successfully`,
      });
      setDifficulty("intermediate");
      setLearningStyle("visual");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate assignment",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!selectedModuleId) {
      toast({
        title: "Error",
        description: "Please select a module",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      moduleId: parseInt(selectedModuleId),
      difficulty,
      learningStyle,
    });
  };

  return (
    <Card data-testid="assignment-generator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          AI Assignment Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Module Selection */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4" />
            Select Module
          </Label>
          <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
            <SelectTrigger data-testid="select-module">
              <SelectValue placeholder="Choose a module..." />
            </SelectTrigger>
            <SelectContent>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id.toString()} data-testid={`option-module-${module.id}`}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Level */}
        <div>
          <Label htmlFor="difficulty" className="mb-2 block">
            Difficulty Level
          </Label>
          <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
            <SelectTrigger data-testid="select-difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner" data-testid="option-beginner">
                Beginner
              </SelectItem>
              <SelectItem value="intermediate" data-testid="option-intermediate">
                Intermediate
              </SelectItem>
              <SelectItem value="advanced" data-testid="option-advanced">
                Advanced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Learning Style */}
        <div>
          <Label htmlFor="learningStyle" className="mb-2 block">
            Learning Style
          </Label>
          <Select value={learningStyle} onValueChange={(v: any) => setLearningStyle(v)}>
            <SelectTrigger data-testid="select-learning-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual" data-testid="option-visual">
                Visual
              </SelectItem>
              <SelectItem value="auditory" data-testid="option-auditory">
                Auditory
              </SelectItem>
              <SelectItem value="kinesthetic" data-testid="option-kinesthetic">
                Kinesthetic
              </SelectItem>
              <SelectItem value="reading" data-testid="option-reading">
                Reading/Writing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        {selectedModuleId && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold" data-testid="generation-summary">
              Generating {difficulty} assignment for {learningStyle} learners
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!selectedModuleId || generateMutation.isPending}
          className="w-full"
          data-testid="button-generate"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Assignment
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
