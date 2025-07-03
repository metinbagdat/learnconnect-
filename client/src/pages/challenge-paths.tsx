import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Trophy, Target, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface ChallengeLearningPath {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  prerequisites: string[];
  tags: string[];
  isActive: boolean;
}

interface ChallengePathProgress {
  id: number;
  currentStep: number;
  completedSteps: number[];
  totalScore: number;
  completionPercentage: number;
  totalSteps: number;
  completedCount: number;
}

export default function ChallengePathsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data: paths = [], isLoading } = useQuery<ChallengeLearningPath[]>({
    queryKey: ["/api/challenge-learning-paths", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" 
        ? "/api/challenge-learning-paths"
        : `/api/challenge-learning-paths?category=${selectedCategory}`;
      const response = await fetch(url);
      return response.json();
    }
  });

  const startPathMutation = useMutation({
    mutationFn: async (pathId: number) => {
      const response = await apiRequest("POST", `/api/challenge-learning-paths/${pathId}/start`);
      return response.json();
    },
    onSuccess: (data, pathId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenge-learning-paths"] });
      toast({
        title: "Learning Path Started!",
        description: "You can now begin working through the challenges."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start learning path",
        variant: "destructive"
      });
    }
  });

  const categories = ["all", "Python", "Web Development", "Mathematics", "Computer Science"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "python": return "🐍";
      case "web development": return "🌐";
      case "mathematics": return "📐";
      case "computer science": return "💻";
      default: return "📚";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Challenge Learning Paths</h1>
        <p className="text-muted-foreground">
          Structured learning journeys with progressive skill challenges
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === "all" ? "All Paths" : category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(path.category)}</span>
                  <div>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {path.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Badge className={getDifficultyColor(path.difficulty)}>
                  {path.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {path.estimatedHours}h
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {path.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {path.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{path.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {path.prerequisites.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Prerequisites:</span>
                    <div className="mt-1">
                      {path.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="mr-1 text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => startPathMutation.mutate(path.id)}
                  disabled={startPathMutation.isPending}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startPathMutation.isPending ? "Starting..." : "Start Learning Path"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paths.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Learning Paths Found</h3>
          <p className="text-muted-foreground">
            {selectedCategory === "all" 
              ? "No learning paths are available at the moment."
              : `No learning paths found for ${selectedCategory}.`
            }
          </p>
        </div>
      )}
    </div>
  );
}