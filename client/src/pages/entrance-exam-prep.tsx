import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Target, Clock, Calendar, Brain, TrendingUp, 
  CheckCircle, Star, Users, Globe, GraduationCap, Trophy,
  ChevronRight, Plus, Zap
} from "lucide-react";

interface ExamType {
  id: string;
  name: string;
  description: string;
  exams: string[];
  subjects: string[];
}

interface ExamLearningPath {
  id: number;
  title: string;
  description: string;
  goal: string;
  examType: string;
  examSubjects: string[];
  difficultyLevel: string;
  estimatedDuration: number;
  targetScore?: number;
  progress: number;
  examDate?: string;
  studySchedule?: any;
  customRequirements?: any;
  createdAt: string;
}

export default function EntranceExamPrep() {
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    currentLevel: "intermediate",
    strengths: "",
    weaknesses: "",
    targetScore: "",
    examDate: "",
    weeklyStudyHours: "10",
    preferredLearningStyle: "mixed",
    specialRequirements: ""
  });

  const { data: examTypes, isLoading: examTypesLoading } = useQuery<ExamType[]>({
    queryKey: ["/api/exam-learning-paths/types"],
  });

  const { data: examPaths, isLoading: pathsLoading } = useQuery<ExamLearningPath[]>({
    queryKey: ["/api/exam-learning-paths"],
  });

  const createPathMutation = useMutation({
    mutationFn: async (pathData: any) => {
      const response = await apiRequest("POST", "/api/exam-learning-paths/generate", pathData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Learning path created!",
        description: "Your personalized exam preparation path has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/exam-learning-paths"] });
      setShowCreateForm(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating path",
        description: error.message || "Failed to create learning path",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      currentLevel: "intermediate",
      strengths: "",
      weaknesses: "",
      targetScore: "",
      examDate: "",
      weeklyStudyHours: "10",
      preferredLearningStyle: "mixed",
      specialRequirements: ""
    });
    setSelectedExamType("");
    setSelectedExam("");
  };

  const handleCreatePath = () => {
    if (!selectedExamType || !selectedExam) {
      toast({
        title: "Missing information",
        description: "Please select an exam type and specific exam.",
        variant: "destructive",
      });
      return;
    }

    const pathData = {
      examType: selectedExamType,
      targetExam: selectedExam,
      currentLevel: formData.currentLevel,
      strengths: formData.strengths.split(",").map(s => s.trim()).filter(s => s),
      weaknesses: formData.weaknesses.split(",").map(s => s.trim()).filter(s => s),
      targetScore: formData.targetScore ? parseInt(formData.targetScore) : undefined,
      examDate: formData.examDate || undefined,
      weeklyStudyHours: parseInt(formData.weeklyStudyHours),
      preferredLearningStyle: formData.preferredLearningStyle,
      specialRequirements: formData.specialRequirements || undefined
    };

    createPathMutation.mutate(pathData);
  };

  const getExamTypeIcon = (examType: string) => {
    switch (examType) {
      case "lycee": return <GraduationCap className="h-5 w-5" />;
      case "college": return <BookOpen className="h-5 w-5" />;
      case "university": return <Brain className="h-5 w-5" />;
      case "turkish_university": return <Globe className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (examTypesLoading || pathsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Entrance Exam Preparation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get ready for success! AI-powered personalized learning paths for lycée, college, and university entrance exams. 
          Create your custom study plan and achieve your academic goals with expert guidance.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI-Generated Paths</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Personalized Content</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Proven Results</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="available-paths" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available-paths">My Learning Paths</TabsTrigger>
          <TabsTrigger value="explore-exams">Explore Exams</TabsTrigger>
          <TabsTrigger value="create-path">Create New Path</TabsTrigger>
        </TabsList>

        <TabsContent value="available-paths" className="space-y-6">
          {examPaths && examPaths.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {examPaths.map((path) => (
                <Card key={path.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getExamTypeIcon(path.examType)}
                        <div>
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <CardDescription className="mt-1">{path.examType.replace('_', ' ').toUpperCase()}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(path.difficultyLevel)}>
                        {path.difficultyLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {path.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{path.estimatedDuration}h</p>
                      </div>
                      {path.targetScore && (
                        <div>
                          <p className="text-muted-foreground">Target Score</p>
                          <p className="font-semibold">{path.targetScore}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {path.examSubjects.slice(0, 3).map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {path.examSubjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.examSubjects.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full" size="sm">
                      Continue Learning
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Learning Paths Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first personalized exam preparation path to get started.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Learning Path
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore-exams" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {examTypes?.map((examType) => (
              <Card key={examType.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getExamTypeIcon(examType.id)}
                    <div>
                      <CardTitle>{examType.name}</CardTitle>
                      <CardDescription>{examType.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Available Exams:</h4>
                    <div className="space-y-1">
                      {examType.exams.map((exam, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{exam}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Core Subjects:</h4>
                    <div className="flex flex-wrap gap-1">
                      {examType.subjects.slice(0, 6).map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {examType.subjects.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{examType.subjects.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      setSelectedExamType(examType.id);
                      setShowCreateForm(true);
                    }}
                  >
                    Create Study Plan
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create-path" className="space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Create AI-Powered Learning Path
              </CardTitle>
              <CardDescription>
                Generate a personalized exam preparation path tailored to your goals and learning style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exam-type">Exam Type</Label>
                  <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-exam">Specific Exam</Label>
                  <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specific exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedExamType && examTypes?.find(t => t.id === selectedExamType)?.exams.map((exam, index) => (
                        <SelectItem key={index} value={exam}>
                          {exam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current-level">Current Level</Label>
                  <Select value={formData.currentLevel} onValueChange={(value) => setFormData({...formData, currentLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning-style">Learning Style</Label>
                  <Select value={formData.preferredLearningStyle} onValueChange={(value) => setFormData({...formData, preferredLearningStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="reading">Reading/Writing</SelectItem>
                      <SelectItem value="practice-based">Practice-Based</SelectItem>
                      <SelectItem value="mixed">Mixed Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="weekly-hours">Weekly Study Hours</Label>
                  <Input
                    id="weekly-hours"
                    type="number"
                    value={formData.weeklyStudyHours}
                    onChange={(e) => setFormData({...formData, weeklyStudyHours: e.target.value})}
                    min="1"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-score">Target Score (optional)</Label>
                  <Input
                    id="target-score"
                    type="number"
                    value={formData.targetScore}
                    onChange={(e) => setFormData({...formData, targetScore: e.target.value})}
                    placeholder="e.g., 1400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam-date">Exam Date (optional)</Label>
                  <Input
                    id="exam-date"
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strengths">Strengths (comma-separated)</Label>
                <Input
                  id="strengths"
                  value={formData.strengths}
                  onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                  placeholder="e.g., Mathematics, Critical Reading, Problem Solving"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaknesses">Areas for Improvement (comma-separated)</Label>
                <Input
                  id="weaknesses"
                  value={formData.weaknesses}
                  onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
                  placeholder="e.g., Essay Writing, Test Strategy, Time Management"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requirements">Special Requirements (optional)</Label>
                <Textarea
                  id="special-requirements"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  placeholder="Any specific requirements or focus areas for your preparation..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleCreatePath} 
                  disabled={createPathMutation.isPending || !selectedExamType || !selectedExam}
                  className="flex-1"
                >
                  {createPathMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Path...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Learning Path
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}