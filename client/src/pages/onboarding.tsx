import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CheckCircle2, BookOpen, Target, Zap, Calendar, AlertCircle } from "lucide-react";

export function OnboardingPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/onboarding/insights"],
  });

  // Fetch plan
  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["/api/onboarding/plan"],
  });

  // Skip onboarding
  const skipOnboarding = useMutation({
    mutationFn: () => apiRequest("POST", "/api/onboarding/skip", {}),
    onSuccess: () => {
      toast({ title: "Onboarding skipped", description: "You can access it anytime from settings" });
    },
  });

  if (insightsLoading || planLoading) {
    return <div className="p-6 text-center">Loading personalized onboarding...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Welcome to LearnConnect!</h1>
          <p className="text-slate-600 dark:text-slate-400">Let's set up your personalized learning path</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main content tabs */}
        <Tabs value={`step-${currentStep}`} className="w-full">
          {/* Step 1: Learning Style */}
          <TabsContent value="step-1">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Your Learning Style
                </CardTitle>
                <CardDescription>We've analyzed your profile to understand how you learn best</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {insights?.learningStyle && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {
                          {
                            visual: "👁️",
                            auditory: "👂",
                            kinesthetic: "✋",
                            reading: "📖",
                          }[insights.learningStyle.style]
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white capitalize">
                          {insights.learningStyle.style} Learner
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                          {insights.learningStyle.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded">
                            <div
                              className="h-full bg-blue-600 rounded"
                              style={{ width: `${insights.learningStyle.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {Math.round(insights.learningStyle.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Recommended study resources:</h4>
                  <ul className="space-y-2">
                    {[
                      "Interactive video tutorials",
                      "Practice exercises matching your style",
                      "Visual progress tracking dashboard",
                      "Adaptive learning recommendations",
                    ].map((resource, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setCurrentStep(2)}
                  size="lg"
                >
                  Continue to Skill Gaps
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Skill Gaps */}
          <TabsContent value="step-2">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Your Skill Gaps
                </CardTitle>
                <CardDescription>Areas we recommend focusing on first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights?.skillGaps?.gaps && insights.skillGaps.gaps.length > 0 ? (
                  insights.skillGaps.gaps.map((gap: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{gap.skill}</h4>
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            gap.priority === "high"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {gap.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                        Current: {gap.proficiency}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">No specific gaps identified</p>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setCurrentStep(3)}>
                    Continue to Study Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Study Plan */}
          <TabsContent value="step-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Your Study Plan
                </CardTitle>
                <CardDescription>Personalized schedule for your learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan?.checkpoints && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{plan.duration}</p>
                      </div>
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Phase</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{plan.phase}</p>
                      </div>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-white">Key Milestones:</h4>
                    <div className="space-y-2">
                      {plan.keyMilestones.map((milestone: any, idx: number) => (
                        <div key={idx} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-2xl">📍</div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{milestone.milestone}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Week {milestone.estimatedWeek}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setCurrentStep(4)}>
                    Continue to Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Goals */}
          <TabsContent value="step-4">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Your Learning Goals
                </CardTitle>
                <CardDescription>AI-recommended objectives for your success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Complete learning assessments to personalize content",
                    "Join our community forums for peer support",
                    "Set up study reminders for consistency",
                    "Track progress with our analytics dashboard",
                  ].map((action, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{action}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    You can always revisit your onboarding plan anytime from your dashboard settings.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCurrentStep(3)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast({ title: "Welcome aboard!", description: "Your personalized learning path is ready" });
                      // Navigate to dashboard
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Skip button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => skipOnboarding.mutate()}
            disabled={skipOnboarding.isPending}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
