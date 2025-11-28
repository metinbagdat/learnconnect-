import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp, BookOpen, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function AiRecommendations() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courseSuggestions, setCourseSuggestions] = useState<any[]>([]);
  const [studyAdjustment, setStudyAdjustment] = useState<any>(null);
  const [generatedCurriculum, setGeneratedCurriculum] = useState<any>(null);
  const [learningGaps, setLearningGaps] = useState<any>(null);

  // Course Suggestions
  const suggestCoursesMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/ai/suggest-courses", data);
      return res.json();
    },
    onSuccess: (data) => {
      setCourseSuggestions(data.suggestions || []);
    }
  });

  // Study Plan Adjustment
  const adjustStudyPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/ai/adjust-study-plan", data);
      return res.json();
    },
    onSuccess: (data) => {
      setStudyAdjustment(data.adjustment || {});
    }
  });

  // Curriculum Generation
  const generateCurriculumMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/ai/generate-curriculum", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedCurriculum(data.curriculum || {});
    }
  });

  // Learning Gap Analysis
  const analyzeLearningGapsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/ai/analyze-learning-gaps", data);
      return res.json();
    },
    onSuccess: (data) => {
      setLearningGaps(data.analysis || {});
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI-Powered Recommendations
          </h1>
          <p className="text-muted-foreground">Personalized insights powered by Claude AI</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Course Suggestions</TabsTrigger>
            <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="gaps">Learning Gaps</TabsTrigger>
          </TabsList>

          {/* COURSE SUGGESTIONS */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  AI Course Suggestions
                </CardTitle>
                <CardDescription>Get personalized course recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Your Interests (comma-separated)</label>
                    <Input id="interests" placeholder="e.g., AI, Web Development, Data Science" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Learning Pace</label>
                    <Input id="pace" placeholder="e.g., slow, moderate, fast" defaultValue="moderate" />
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    const interests = (document.getElementById("interests") as HTMLInputElement)?.value.split(",").map(i => i.trim()) || [];
                    const pace = (document.getElementById("pace") as HTMLInputElement)?.value || "moderate";
                    suggestCoursesMutation.mutate({ interests, learningPace: pace, skillLevel: "intermediate" });
                  }}
                  disabled={suggestCoursesMutation.isPending}
                  className="w-full"
                >
                  {suggestCoursesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Suggestions
                </Button>

                {courseSuggestions.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {courseSuggestions.map((course: any, idx: number) => (
                      <div key={idx} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{course.title}</h4>
                          <Badge variant="secondary">{course.difficulty_level || course.difficultyLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                        <p className="text-xs"><strong>Why:</strong> {course.reason_why_recommended || course.reasonWhyRecommended}</p>
                        <p className="text-xs text-blue-600"><strong>Duration:</strong> {course.estimated_duration || course.estimatedDuration} hours</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* STUDY PLAN ADJUSTMENT */}
          <TabsContent value="study-plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  AI Study Plan Adjustment
                </CardTitle>
                <CardDescription>Get AI recommendations to optimize your study plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Current Progress (%)</label>
                    <Input id="progress" type="number" placeholder="e.g., 45" defaultValue="45" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Weekly Study Hours</label>
                    <Input id="hours" type="number" placeholder="e.g., 5" defaultValue="5" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Recent Assignment Scores (comma-separated)</label>
                  <Input id="scores" placeholder="e.g., 85, 78, 92, 80" defaultValue="85, 78, 92, 80" />
                </div>
                <Button 
                  onClick={() => {
                    const progress = parseInt((document.getElementById("progress") as HTMLInputElement)?.value || "0");
                    const hours = parseInt((document.getElementById("hours") as HTMLInputElement)?.value || "5");
                    const scores = (document.getElementById("scores") as HTMLInputElement)?.value.split(",").map(s => parseInt(s.trim())) || [];
                    adjustStudyPlanMutation.mutate({ currentProgress: progress, timeSpentPerWeek: hours, assignmentScores: scores });
                  }}
                  disabled={adjustStudyPlanMutation.isPending}
                  className="w-full"
                >
                  {adjustStudyPlanMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get AI Recommendations
                </Button>

                {studyAdjustment && Object.keys(studyAdjustment).length > 0 && (
                  <div className="space-y-3 mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    {studyAdjustment.adjustedWeeklyHours && (
                      <div>
                        <p className="font-semibold text-sm">📅 Adjusted Weekly Hours: {studyAdjustment.adjustedWeeklyHours}</p>
                      </div>
                    )}
                    {studyAdjustment.focusAreas && (
                      <div>
                        <p className="font-semibold text-sm">🎯 Focus Areas: {Array.isArray(studyAdjustment.focusAreas) ? studyAdjustment.focusAreas.join(", ") : studyAdjustment.focusAreas}</p>
                      </div>
                    )}
                    {studyAdjustment.paceRecommendation && (
                      <div>
                        <p className="font-semibold text-sm">⚡ Pace: {studyAdjustment.paceRecommendation}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CURRICULUM GENERATION */}
          <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Curriculum Generator
                </CardTitle>
                <CardDescription>Generate a structured curriculum for any course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Course Title</label>
                    <Input id="courseTitle" placeholder="e.g., Advanced Python Programming" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (weeks)</label>
                    <Input id="duration" type="number" placeholder="e.g., 8" defaultValue="8" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input id="audience" placeholder="e.g., Intermediate developers with Python basics" />
                </div>
                <div>
                  <label className="text-sm font-medium">Course Description</label>
                  <Textarea id="desc" placeholder="Describe the course topics and goals" className="h-24" />
                </div>
                <Button 
                  onClick={() => {
                    const title = (document.getElementById("courseTitle") as HTMLInputElement)?.value || "New Course";
                    const duration = parseInt((document.getElementById("duration") as HTMLInputElement)?.value || "8");
                    const audience = (document.getElementById("audience") as HTMLInputElement)?.value || "General";
                    const desc = (document.getElementById("desc") as HTMLTextAreaElement)?.value || "";
                    generateCurriculumMutation.mutate({ courseTitle: title, durationWeeks: duration, targetAudience: audience, description: desc });
                  }}
                  disabled={generateCurriculumMutation.isPending}
                  className="w-full"
                >
                  {generateCurriculumMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Curriculum
                </Button>

                {generatedCurriculum && generatedCurriculum.modules && (
                  <div className="space-y-3 mt-4">
                    {generatedCurriculum.modules.map((module: any, idx: number) => (
                      <div key={idx} className="p-3 border rounded-lg space-y-2">
                        <h4 className="font-semibold">{module.title || `Module ${idx + 1}`}</h4>
                        {module.objectives && <p className="text-sm text-muted-foreground">{module.objectives}</p>}
                        {module.lessons && (
                          <div className="ml-4 space-y-1">
                            {Array.isArray(module.lessons) && module.lessons.map((lesson: any, lidx: number) => (
                              <p key={lidx} className="text-xs">• {lesson.title} ({lesson.duration})</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LEARNING GAPS */}
          <TabsContent value="gaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyze Learning Gaps</CardTitle>
                <CardDescription>Get AI recommendations for areas needing improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Topics & Scores (e.g., "Algebra: 65, Calculus: 85")</label>
                  <Textarea id="gapData" placeholder="Topic: score, separated by commas" className="h-24" />
                </div>
                <Button 
                  onClick={() => {
                    const data = (document.getElementById("gapData") as HTMLTextAreaElement)?.value || "";
                    const assignments = data.split(",").map(item => {
                      const [topic, score] = item.split(":").map(s => s.trim());
                      return { topic, score: parseInt(score) || 0 };
                    });
                    analyzeLearningGapsMutation.mutate({ userId: 1, completedAssignments: assignments });
                  }}
                  disabled={analyzeLearningGapsMutation.isPending}
                  className="w-full"
                >
                  {analyzeLearningGapsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Gaps
                </Button>

                {learningGaps && Object.keys(learningGaps).length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg mt-4 space-y-2">
                    {learningGaps.interventions && Array.isArray(learningGaps.interventions) && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Recommended Interventions:</p>
                        {learningGaps.interventions.map((item: any, idx: number) => (
                          <p key={idx} className="text-xs">• {item.topic}: {item.resource}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
