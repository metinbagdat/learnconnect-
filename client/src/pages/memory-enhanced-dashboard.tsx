import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, BookOpen, TrendingUp, BarChart3 } from "lucide-react";

interface CognitiveProfile {
  learningStyle: string;
  attentionSpan: number;
  memoryCapacity: number;
  processingSpeed: number;
  preferredTechniques: string[];
  techniqueEffectiveness: Record<string, number>;
}

interface MemoryTechnique {
  id: number;
  name: string;
  effectiveness: number;
  type: string;
}

interface TrainingExercise {
  id: number;
  type: string;
  duration: number;
  difficulty: string;
}

export default function MemoryEnhancedDashboard() {
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
  const [techniques, setTechniques] = useState<MemoryTechnique[]>([]);
  const [training, setTraining] = useState<TrainingExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulated data - would connect to real API endpoints
      setCognitiveProfile({
        learningStyle: "visual",
        attentionSpan: 45,
        memoryCapacity: 0.82,
        processingSpeed: 1.2,
        preferredTechniques: ["method_of_loci", "mnemonic_generation", "spaced_repetition"],
        techniqueEffectiveness: {
          method_of_loci: 0.88,
          mnemonic_generation: 0.82,
          spaced_repetition: 0.91,
        },
      });

      setTechniques([
        { id: 1, name: "Method of Loci", effectiveness: 0.88, type: "memory_palace" },
        { id: 2, name: "Mnemonic Generation", effectiveness: 0.82, type: "mnemonics" },
        { id: 3, name: "Spaced Repetition", effectiveness: 0.91, type: "repetition" },
      ]);

      setTraining([
        { id: 1, type: "concentration", duration: 15, difficulty: "medium" },
        { id: 2, type: "memory", duration: 20, difficulty: "medium" },
        { id: 3, type: "pattern_recognition", duration: 15, difficulty: "hard" },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-semibold">Loading your cognitive profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              AI-Powered Memory Enhanced Learning
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Your personalized cognitive dashboard with memory techniques and spaced repetition
          </p>
        </div>

        {/* Key Metrics */}
        {cognitiveProfile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Memory Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(cognitiveProfile.memoryCapacity * 100)}%</div>
                <Progress value={cognitiveProfile.memoryCapacity * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Learning Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{cognitiveProfile.learningStyle}</div>
                <p className="text-xs text-slate-500 mt-1">Optimized for your style</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Attention Span</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cognitiveProfile.attentionSpan}m</div>
                <p className="text-xs text-slate-500 mt-1">Focus duration</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="text-2xl font-bold">+42%</div>
                </div>
                <p className="text-xs text-slate-500 mt-1">vs. standard learning</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="techniques" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="techniques">
              <BookOpen className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
            <TabsTrigger value="training">
              <Zap className="w-4 h-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="curriculum">
              <BarChart3 className="w-4 h-4 mr-2" />
              Curriculum
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Memory Techniques Tab */}
          <TabsContent value="techniques" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Active Memory Techniques</CardTitle>
                <CardDescription>
                  Personalized memory techniques based on your learning style and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {techniques.map((tech) => (
                    <div
                      key={tech.id}
                      className="border rounded-lg p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{tech.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{tech.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(tech.effectiveness * 100)}%
                          </div>
                          <p className="text-xs text-slate-500">Effectiveness</p>
                        </div>
                      </div>
                      <Progress value={tech.effectiveness * 100} className="h-2" />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                        <Button size="sm" variant="outline">
                          Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discover New Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  📚 Explore Memory Enhancement Techniques
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cognitive Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>💪 Daily Cognitive Training</CardTitle>
                <CardDescription>
                  Strengthen your memory and focus with personalized brain exercises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {training.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <div>
                        <h3 className="font-semibold capitalize text-slate-900 dark:text-white">
                          {exercise.type.replace(/_/g, " ")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {exercise.duration} minutes • {exercise.difficulty}
                        </p>
                      </div>
                      <Button>Start</Button>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Today's Progress
                  </h4>
                  <Progress value={40} className="mb-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    2 of 5 exercises completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Memory-Enhanced Curriculum</CardTitle>
                <CardDescription>
                  Curriculum optimized with memory techniques and spaced repetition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                      Expected Improvements
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Retention Rate</span>
                          <span className="font-semibold">+38%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Study Time Reduction</span>
                          <span className="font-semibold">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Learning Efficiency</span>
                          <span className="font-semibold">+42%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                      Optimization Features
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Spaced repetition scheduling
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Memory technique integration
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Cognitive load balancing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                        Adaptive difficulty
                      </li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Generate Memory-Enhanced Curriculum
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Your Learning Progress</CardTitle>
                <CardDescription>
                  Track your retention, learning velocity, and overall performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Average Retention
                    </h3>
                    <div className="text-3xl font-bold text-green-600">82%</div>
                    <p className="text-sm text-slate-500 mt-1">↑ 12% from last week</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Learning Velocity
                    </h3>
                    <div className="text-3xl font-bold text-blue-600">2.3</div>
                    <p className="text-sm text-slate-500 mt-1">Topics per week</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Consistency Score
                    </h3>
                    <div className="text-3xl font-bold text-purple-600">85%</div>
                    <p className="text-sm text-slate-500 mt-1">Your dedication</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Estimated Mastery Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Progress</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-3" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      Estimated completion: 25 days at current pace
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🤖 AI Memory Assistant Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    💡 Tip: Increase spaced repetition frequency
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    Your retention is above average for high-complexity topics
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    ✅ You're on track!
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                    Your learning velocity is accelerating. Great progress!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
