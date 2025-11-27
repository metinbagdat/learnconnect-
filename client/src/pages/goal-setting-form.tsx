import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Zap, Target, AlertCircle, CheckCircle2, Loader } from "lucide-react";

export function GoalSettingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "academic",
    deadline: "",
    priority: 2,
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Fetch suggestions
  const { data: suggestions } = useQuery({
    queryKey: ["/api/goals/suggestions", formData.type],
    queryFn: () =>
      apiRequest("GET", `/api/goals/suggestions?type=${formData.type}`).then((r) => r.data),
  });

  // Mutations
  const generateDescription = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/goals/generate-description", {
        title: formData.title,
        goalType: formData.type,
      }),
    onSuccess: (data) => {
      setFormData((prev) => ({ ...prev, description: data.data.description }));
      toast({ title: "Generated", description: "AI description created" });
    },
  });

  const analyzeGoal = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/goals/analyze", {
        title: formData.title,
        description: formData.description,
        goalType: formData.type,
        deadline: formData.deadline,
      }),
    onSuccess: () => {
      setShowAnalysis(true);
    },
  });

  const suggestDeadline = useMutation({
    mutationFn: () =>
      apiRequest("GET", `/api/goals/suggest-deadline?goalType=${formData.type}`),
    onSuccess: (data) => {
      const deadline = new Date(data.data.deadline);
      setFormData((prev) => ({
        ...prev,
        deadline: deadline.toISOString().split("T")[0],
      }));
      toast({ title: "Suggested", description: "AI deadline recommended" });
    },
  });

  const saveGoal = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/goals/save", {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        deadline: new Date(formData.deadline),
        priority: formData.priority,
      }),
    onSuccess: () => {
      toast({ title: "Success!", description: "Goal created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/ai/dashboard/goals"] });
      setFormData({
        title: "",
        description: "",
        type: "academic",
        deadline: "",
        priority: 2,
      });
      setShowAnalysis(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save goal",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Set Your Learning Goal</h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI Assistant Active
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Goal Title *
            </label>
            <Input
              placeholder="What do you want to achieve?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Description
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateDescription.mutate()}
                disabled={!formData.title || generateDescription.isPending}
              >
                <Zap className="w-4 h-4 mr-1" />
                AI Generate
              </Button>
            </div>
            <textarea
              placeholder="Describe your goal in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 p-2 border rounded dark:bg-slate-900 dark:border-slate-700"
            />
          </div>

          {/* Goal Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Goal Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700"
            >
              <option value="academic">Academic</option>
              <option value="career">Career</option>
              <option value="skill">Skill Development</option>
              <option value="personal">Personal Growth</option>
            </select>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Target Deadline
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => suggestDeadline.mutate()}
                disabled={suggestDeadline.isPending}
              >
                <Zap className="w-4 h-4 mr-1" />
                Suggest
              </Button>
            </div>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700"
            >
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
              <option value="4">Critical</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Goal Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((sugg: any) => (
              <div
                key={sugg.id}
                className="p-3 border rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                onClick={() => {
                  setFormData({
                    ...formData,
                    title: sugg.title,
                    description: sugg.description,
                  });
                  setSelectedSuggestion(sugg);
                }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{sugg.title}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                    {Math.round(sugg.confidenceScore * 100)}%
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {sugg.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Analysis */}
      {showAnalysis && analyzeGoal.data && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <Zap className="w-5 h-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Confidence */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  AI Confidence
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {analyzeGoal.data.data.confidence}%
                </span>
              </div>
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded">
                <div
                  className="h-full bg-blue-600 rounded"
                  style={{ width: `${analyzeGoal.data.data.confidence}%` }}
                />
              </div>
            </div>

            {/* Analysis */}
            <p className="text-sm text-blue-900 dark:text-blue-200">{analyzeGoal.data.data.analysis}</p>

            {/* Milestones */}
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Milestones</h4>
              <ul className="space-y-1">
                {analyzeGoal.data.data.milestones.map((m: string, i: number) => (
                  <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Challenges */}
            {analyzeGoal.data.data.potentialChallenges.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Potential Challenges
                </h4>
                <ul className="space-y-1">
                  {analyzeGoal.data.data.potentialChallenges.map((c: string, i: number) => (
                    <li key={i} className="text-sm text-blue-800 dark:text-blue-200">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => analyzeGoal.mutate()}
          disabled={!formData.title || analyzeGoal.isPending}
          variant="outline"
          className="gap-2"
        >
          {analyzeGoal.isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Analyze with AI
        </Button>
        <Button
          onClick={() => saveGoal.mutate()}
          disabled={!formData.title || !formData.deadline || saveGoal.isPending}
          className="gap-2"
        >
          {saveGoal.isPending ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Create Goal
        </Button>
      </div>
    </div>
  );
}
