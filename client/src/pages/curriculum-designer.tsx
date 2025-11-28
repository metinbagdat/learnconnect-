import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen } from "lucide-react";

export function CurriculumDesigner() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeDesign, setActiveDesign] = useState<number | null>(null);

  const { data: designs = [] } = useQuery({
    queryKey: ["/api/curriculum-designs", user?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/curriculum-designs");
      return res.json();
    },
    enabled: !!user,
  });

  const createDesignMutation = useMutation({
    mutationFn: async (newDesign: any) => {
      const res = await apiRequest("POST", "/api/curriculum-designs", newDesign);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Design created successfully" });
    },
  });

  const [courseTitle, setCourseTitle] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [hours, setHours] = useState(40);

  const handleCreateDesign = async () => {
    if (!courseTitle) {
      toast({ title: "Please enter a course title", variant: "destructive" });
      return;
    }

    createDesignMutation.mutate({
      designName: courseTitle,
      parameters: { courseTitle, difficultyLevel: difficulty, estimatedHours: hours },
      successMetrics: { targetEffectiveness: 85 },
      stage: "parameters",
      status: "draft",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Curriculum Design System
            </CardTitle>
            <CardDescription>
              Three-Part Architecture: Input Parameters → Success Metrics → Design Process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PART 1: INPUT PARAMETERS */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-3">Part 1: Input Parameters</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define what goes into your course design
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Course Title</label>
                  <Input
                    placeholder="E.g., Advanced Web Development"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Hours</label>
                    <Input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      min={10}
                      max={200}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateDesign} disabled={createDesignMutation.isPending}>
                  Start Design
                </Button>
              </div>
            </div>

            {/* PART 2: SUCCESS METRICS FRAMEWORK */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Part 2: Success Metrics
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                How effectiveness is measured dynamically
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted p-3 rounded">
                    <p className="font-medium">Engagement Score</p>
                    <p className="text-xs text-muted-foreground">0-100 scale</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="font-medium">Mastery Level</p>
                    <p className="text-xs text-muted-foreground">Skill proficiency</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="font-medium">Completion Rate</p>
                    <p className="text-xs text-muted-foreground">% of course completed</p>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="font-medium">Satisfaction Rating</p>
                    <p className="text-xs text-muted-foreground">Student feedback (1-5)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PART 3: DESIGN PROCESS */}
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-3">Part 3: Design Process</h3>
              <p className="text-sm text-muted-foreground mb-4">
                How all elements interconnect dynamically
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Design Progress</p>
                    <Progress value={activeDesign ? 25 : 0} className="h-2" />
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>✓ Workflow: Parameters → Content → Delivery → Validation → Deployment</p>
                  <p>✓ Metrics feed into parameter optimization</p>
                  <p>✓ AI provides real-time recommendations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE DESIGNS */}
        {designs.length > 0 && (
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Designs</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-3">
              {designs.filter((d: any) => d.status !== "archived").map((design: any) => (
                <Card key={design.id} className="cursor-pointer hover:border-primary" onClick={() => setActiveDesign(design.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{design.designName}</CardTitle>
                        <CardDescription>Stage: {design.stage}</CardDescription>
                      </div>
                      <Badge variant={design.status === "active" ? "default" : "secondary"}>
                        {design.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{design.progressPercent}%</span>
                      </div>
                      <Progress value={design.progressPercent} className="h-2" />
                      {design.currentEffectiveness && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Effectiveness: {parseFloat(design.currentEffectiveness).toFixed(1)}% / {design.targetEffectiveness}%
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
