import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CurriculumPreview {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  curriculum: any;
  modulesCount: number;
  totalHours: number;
}

interface Props {
  preview: CurriculumPreview;
  onClose: () => void;
}

export function CurriculumEditor({ preview, onClose }: Props) {
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [editedCurriculum, setEditedCurriculum] = useState(preview.curriculum);

  const toggleModule = (idx: number) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedModules(newSet);
  };

  // Publish curriculum mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/curriculum/publish", {
        courseId: preview.courseId,
        curriculum: editedCurriculum,
      });
      if (!res.ok) throw new Error("Failed to publish curriculum");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✓ Curriculum Published!",
        description: `Curriculum saved with ${data.data.modulesCount} modules`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to Publish",
        description: "Could not save curriculum. Try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden" data-testid="curriculum-editor">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4" data-testid="editor-header">
          <div>
            <CardTitle>Review & Edit Curriculum</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{preview.courseTitle}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={publishMutation.isPending}
            data-testid="button-close-editor"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <ScrollArea className="h-[calc(90vh-200px)]">
          <CardContent className="pt-6 space-y-6" data-testid="editor-content">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded" data-testid="curriculum-summary">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{preview.totalHours.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold">{editedCurriculum.modules?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="text-2xl font-bold">
                  {editedCurriculum.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0}
                </p>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-4" data-testid="modules-list">
              {editedCurriculum.modules?.map((module: any, moduleIdx: number) => (
                <Card key={moduleIdx} data-testid={`module-card-${moduleIdx}`}>
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 pb-3"
                    onClick={() => toggleModule(moduleIdx)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold" data-testid={`module-title-${moduleIdx}`}>
                            {module.title}
                          </h4>
                          <Badge variant="outline" data-testid={`module-difficulty-${moduleIdx}`}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{module.objectives?.join("; ")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" data-testid={`module-hours-${moduleIdx}`}>
                          {module.estimatedHours}h
                        </Badge>
                        {expandedModules.has(moduleIdx) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {expandedModules.has(moduleIdx) && (
                    <CardContent className="space-y-3 border-t pt-4" data-testid={`module-lessons-${moduleIdx}`}>
                      {module.lessons?.map((lesson: any, lessonIdx: number) => (
                        <div
                          key={lessonIdx}
                          className="p-3 bg-gray-50 dark:bg-gray-900 rounded space-y-2"
                          data-testid={`lesson-card-${moduleIdx}-${lessonIdx}`}
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="font-medium" data-testid={`lesson-title-${moduleIdx}-${lessonIdx}`}>
                              {lesson.title}
                            </h5>
                            <Badge variant="outline" className="text-xs" data-testid={`lesson-duration-${moduleIdx}-${lessonIdx}`}>
                              {lesson.duration}m
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground" data-testid={`lesson-content-${moduleIdx}-${lessonIdx}`}>
                            {lesson.content}
                          </p>
                          {lesson.concepts?.length > 0 && (
                            <div className="flex flex-wrap gap-1" data-testid={`lesson-concepts-${moduleIdx}-${lessonIdx}`}>
                              {lesson.concepts.map((concept: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-900">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={publishMutation.isPending}
            data-testid="button-cancel-publish"
          >
            Cancel
          </Button>
          <Button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
            className="gap-2"
            data-testid="button-publish-curriculum"
          >
            {publishMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Curriculum
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
