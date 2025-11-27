import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CheckCircle2, TrendingUp, Zap, BookOpen, HelpCircle, X } from "lucide-react";

export function PreCourseGuidance() {
  const { toast } = useToast();
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);

  // Fetch guidance
  const { data: guidance, isLoading } = useQuery({
    queryKey: ["/api/ai/suggestions/pre-course"],
  });

  // Explain reasoning
  const explainReasoning = useMutation({
    mutationFn: (suggestion: any) =>
      apiRequest("POST", "/api/ai/suggest/explain-reasoning", { suggestion }),
    onSuccess: (data) => {
      setExpandedReasoning(JSON.stringify(data.data, null, 2));
    },
  });

  // Accept suggestion
  const acceptSuggestion = useMutation({
    mutationFn: (suggestion: any) =>
      apiRequest("POST", "/api/ai/suggest/accept", { suggestion }),
    onSuccess: () => {
      toast({
        title: "Plan Accepted!",
        description: "Your personalized learning journey begins now",
      });
    },
  });

  // Reject suggestion
  const rejectSuggestion = useMutation({
    mutationFn: (suggestionId: string) =>
      apiRequest("POST", "/api/ai/suggest/reject", {
        suggestionId,
        reason: "User preference",
      }),
    onSuccess: () => {
      toast({
        title: "Feedback noted",
        description: "This helps us improve our recommendations",
      });
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center">Loading AI recommendations...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Your AI-Powered Learning Path
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Personalized recommendations with {guidance?.aiConfidence || 0}% confidence
        </p>
      </div>

      {/* AI Explanation */}
      {guidance?.explanation && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900 dark:text-blue-200">{guidance.explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Section */}
      {guidance?.goalSuggestions && guidance.goalSuggestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Recommended Goals
          </h2>
          <div className="grid gap-4">
            {guidance.goalSuggestions.map((goal: any, idx: number) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {goal.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        Confidence
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(goal.confidence * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Estimated time:</span> {goal.estimatedTime}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      "{goal.reasoning}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        acceptSuggestion.mutate(goal);
                        setSelectedSuggestion(goal);
                      }}
                      disabled={acceptSuggestion.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => explainReasoning.mutate(goal)}
                      disabled={explainReasoning.isPending}
                    >
                      <HelpCircle className="w-4 h-4 mr-1" />
                      Explain
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => rejectSuggestion.mutate(goal.id)}
                      disabled={rejectSuggestion.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths Section */}
      {guidance?.learningPathSuggestions && guidance.learningPathSuggestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Suggested Learning Paths
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {guidance.learningPathSuggestions.map((path: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {path.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {path.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {path.estimatedTime}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">
                      {Math.round(path.confidence * 100)}%
                    </span>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Select Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Study Plans Section */}
      {guidance?.studyPlanSuggestions && guidance.studyPlanSuggestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Personalized Study Plans
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {guidance.studyPlanSuggestions.map((plan: any, idx: number) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedSuggestion?.id === plan.id ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => setSelectedSuggestion(plan)}
              >
                <CardContent className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {plan.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Timeline:</span> {plan.estimatedTime}
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded">
                      <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${plan.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Reasoning */}
      {expandedReasoning && (
        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg">AI Reasoning Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto max-h-64">
              {expandedReasoning}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
