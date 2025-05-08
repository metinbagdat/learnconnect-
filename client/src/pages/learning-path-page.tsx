import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Loader2, Plus, ChevronRight, Check, Award, FileText, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { LearningPath, LearningPathStep, Course } from "@shared/schema";

export default function LearningPathPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [careerField, setCareerField] = useState("");
  const [timeframe, setTimeframe] = useState("6 months");

  // Fetch user's learning paths or a specific learning path
  const { data: learningPath, isLoading: pathLoading } = useQuery({
    queryKey: [id ? `/api/learning-paths/${id}` : '/api/learning-paths'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0]);
      if (!response.ok) throw new Error("Failed to load learning path");
      return await response.json();
    },
    enabled: !!id,
  });

  const { data: learningPaths = [], isLoading: pathsLoading } = useQuery({
    queryKey: ['/api/learning-paths'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0]);
      if (!response.ok) throw new Error("Failed to load learning paths");
      return await response.json();
    },
    enabled: !id,
  });

  // Mutation to generate a new learning path
  const generatePathMutation = useMutation({
    mutationFn: async (data: { goal: string, careerField: string, timeframe: string }) => {
      const res = await apiRequest("POST", "/api/learning-paths", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Learning path created",
        description: "Your personalized learning journey has been created!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/learning-paths'] });
      navigate(`/learning-paths/${data.id}`);
      setIsGenerateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create learning path",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to mark a step as completed
  const completeStepMutation = useMutation({
    mutationFn: async (stepId: number) => {
      const res = await apiRequest("PATCH", `/api/learning-paths/steps/${stepId}/complete`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress updated",
        description: "Your learning progress has been updated.",
      });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [`/api/learning-paths/${id}`] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create a new learning path
  const handleCreatePath = () => {
    if (!goalInput.trim()) {
      toast({
        title: "Goal required",
        description: "Please enter a learning goal",
        variant: "destructive",
      });
      return;
    }
    generatePathMutation.mutate({
      goal: goalInput,
      careerField: careerField,
      timeframe: timeframe
    });
  };

  // Mark a learning path step as completed
  const handleCompleteStep = (stepId: number) => {
    completeStepMutation.mutate(stepId);
  };

  // If we're on /learning-paths (index) show the list of paths
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Learning Paths</h1>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Path
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Career-Focused Learning Path</DialogTitle>
                <DialogDescription>
                  Enter your learning goal, target career field, and timeframe to have our AI generate a personalized curriculum that prepares you for your desired profession.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Become a full-stack web developer"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="careerField">Target Career Field</Label>
                  <Input
                    id="careerField"
                    placeholder="e.g., Software Engineering, Data Science, UI/UX Design"
                    value={careerField}
                    onChange={(e) => setCareerField(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Specify your target profession or career path</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Learning Timeframe</Label>
                  <select
                    id="timeframe"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                  </select>
                  <p className="text-xs text-muted-foreground">How much time you plan to dedicate to this learning path</p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreatePath} 
                  disabled={generatePathMutation.isPending}
                >
                  {generatePathMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Learning Path
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {pathsLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : learningPaths.length === 0 ? (
          <div className="text-center p-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Learning Paths Yet</h3>
            <p className="text-muted-foreground mb-6">Create your first personalized learning journey</p>
            <Button onClick={() => setIsGenerateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Learning Path
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learningPaths.map((path: LearningPath) => (
              <Link key={path.id} href={`/learning-paths/${path.id}`}>
                <a className="block transition-all hover:scale-105">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>{path.title}</CardTitle>
                      <CardDescription>Goal: {path.goal}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        {path.estimatedDuration || 12} weeks estimated
                      </div>
                    </CardFooter>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // If we're on a specific learning path page (/learning-paths/:id)
  return (
    <div className="container mx-auto px-4 py-8">
      {pathLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !learningPath ? (
        <div className="text-center p-12">
          <h3 className="text-xl font-medium mb-2">Learning Path Not Found</h3>
          <p className="text-muted-foreground mb-6">The learning path you're looking for doesn't exist or was removed.</p>
          <Button asChild>
            <Link href="/learning-paths">Back to Learning Paths</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{learningPath.title}</h1>
              <p className="text-lg text-muted-foreground mb-2">Goal: {learningPath.goal}</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline">{learningPath.estimatedDuration || 12} weeks</Badge>
                <Badge variant="outline">{learningPath.steps?.length || 0} courses</Badge>
                <Badge variant="outline">AI-Generated</Badge>
              </div>
            </div>
            <div className="md:text-right">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{learningPath.progress}%</span>
                </div>
                <Progress value={learningPath.progress} className="h-2 w-full md:w-[200px]" />
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">{learningPath.description}</p>
            </div>

            {/* Visual Journey Map */}
            <h2 className="text-xl font-bold mb-4">Your Learning Journey</h2>
            <div className="space-y-8 relative">
              {/* Left side timeline */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

              {learningPath.steps?.map((step: LearningPathStep & { course: Course }, index: number) => (
                <div key={step.id} className="relative pl-16">
                  {/* Timeline circle */}
                  <div className={`absolute left-[30px] top-0 w-4 h-4 rounded-full ${step.completed ? 'bg-primary' : 'bg-background border-2 border-primary'}`}>
                    {step.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>

                  {/* Step number */}
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{step.course.title}</CardTitle>
                        {step.required && (
                          <Badge className="ml-2">Required</Badge>
                        )}
                      </div>
                      <CardDescription>{step.course.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{step.notes}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        {step.course.durationHours || 10} hours
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/courses/${step.course.id}`}>
                            View Course
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteStep(step.id)}
                          disabled={step.completed || completeStepMutation.isPending}
                        >
                          {step.completed ? (
                            <>
                              <Check className="mr-1 h-4 w-4" /> Completed
                            </>
                          ) : (
                            <>
                              Mark Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}

              {/* Completion marker */}
              <div className="relative pl-16">
                <div className="absolute left-[30px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                  <Award className="h-4 w-4" />
                </div>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Journey Complete!</CardTitle>
                    <CardDescription>Complete all required courses to achieve your learning goal</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}