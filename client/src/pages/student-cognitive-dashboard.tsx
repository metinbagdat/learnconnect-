import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Brain,
  TrendingUp,
  Clock,
  Zap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";

interface CognitiveInsight {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  icon: React.ReactNode;
}

interface MemoryEnhancedCurriculum {
  id: number;
  name: string;
  enhancementLevel: number;
  timeReduction: number;
  retentionImprovement: number;
  techniquesApplied: string[];
}

interface PerformancePrediction {
  metric: string;
  current: number;
  predicted: number;
  trend: "up" | "down" | "stable";
}

export default function StudentCognitiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cognitiveData, setCognitiveData] = useState({
    averageRetention: 82,
    learningVelocity: 2.3,
    consistencyScore: 85,
    efficiency: 42,
  });

  const learningAnalytics = [
    { day: "Mon", retention: 78, engagement: 85, efficiency: 38 },
    { day: "Tue", retention: 81, engagement: 88, efficiency: 40 },
    { day: "Wed", retention: 79, engagement: 82, efficiency: 39 },
    { day: "Thu", retention: 85, engagement: 90, efficiency: 45 },
    { day: "Fri", retention: 88, engagement: 92, efficiency: 48 },
    { day: "Sat", retention: 82, engagement: 87, efficiency: 42 },
    { day: "Sun", retention: 80, engagement: 83, efficiency: 40 },
  ];

  const cognitiveInsights: CognitiveInsight[] = [
    {
      title: "Optimal Study Times Identified",
      description: "Your peak cognitive performance is between 9-11 AM and 3-5 PM",
      impact: "high",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      title: "Memory Technique Recommendation",
      description: "Method of Loci shows 88% effectiveness for your learning style",
      impact: "high",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Focus Optimization",
      description: "Your attention span is 45 minutes; break frequency: every 45 min",
      impact: "medium",
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "Learning Efficiency Tips",
      description: "Combining spaced repetition with active recall could increase retention by 35%",
      impact: "high",
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ];

  const enhancedCurricula: MemoryEnhancedCurriculum[] = [
    {
      id: 1,
      name: "Advanced Mathematics",
      enhancementLevel: 85,
      timeReduction: 35,
      retentionImprovement: 42,
      techniquesApplied: ["spaced_repetition", "method_of_loci", "active_recall"],
    },
    {
      id: 2,
      name: "Physics Fundamentals",
      enhancementLevel: 78,
      timeReduction: 28,
      retentionImprovement: 35,
      techniquesApplied: ["visual_representation", "chunking", "mnemonic_generation"],
    },
    {
      id: 3,
      name: "Chemistry Deep Dive",
      enhancementLevel: 72,
      timeReduction: 25,
      retentionImprovement: 30,
      techniquesApplied: ["spaced_repetition", "pattern_recognition"],
    },
  ];

  const performancePredictions: PerformancePrediction[] = [
    { metric: "Retention Rate", current: 82, predicted: 90, trend: "up" },
    { metric: "Study Efficiency", current: 42, predicted: 58, trend: "up" },
    { metric: "Learning Velocity", current: 2.3, predicted: 3.1, trend: "up" },
    { metric: "Consistency Score", current: 85, predicted: 92, trend: "up" },
  ];

  const techniquesUsed = [
    { name: "Spaced Repetition", value: 35, color: "#8b5cf6" },
    { name: "Memory Palace", value: 28, color: "#ec4899" },
    { name: "Active Recall", value: 22, color: "#06b6d4" },
    { name: "Mnemonics", value: 15, color: "#10b981" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Student Cognitive Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            AI-powered insights into your learning, memory techniques, and performance predictions
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cognitiveData.averageRetention}%</div>
              <Progress value={cognitiveData.averageRetention} className="mt-2" />
              <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Learning Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cognitiveData.learningVelocity}</div>
              <p className="text-xs text-slate-500 mt-2">Topics per week</p>
              <p className="text-xs text-green-600">↑ Accelerating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cognitiveData.consistencyScore}%</div>
              <Progress value={cognitiveData.consistencyScore} className="mt-2" />
              <p className="text-xs text-slate-500 mt-1">Your dedication</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div className="text-2xl font-bold">+{cognitiveData.efficiency}%</div>
              </div>
              <p className="text-xs text-slate-500 mt-2">vs. standard learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🧠 Cognitive Insights</CardTitle>
                <CardDescription>AI-powered recommendations for optimized learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cognitiveInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 pl-4 py-3 rounded ${
                      insight.impact === "high"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : insight.impact === "medium"
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                          : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-slate-700 dark:text-slate-300 mt-1">
                        {insight.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📊 Learning Analytics</CardTitle>
                <CardDescription>Weekly performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={learningAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="#8b5cf6"
                      name="Retention %"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#06b6d4"
                      name="Engagement %"
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#10b981"
                      name="Efficiency %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Memory-Enhanced Curricula</CardTitle>
                <CardDescription>Your personalized learning paths with enhancement levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedCurricula.map((curriculum) => (
                  <div
                    key={curriculum.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {curriculum.name}
                        </h3>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {curriculum.techniquesApplied.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {curriculum.enhancementLevel}%
                        </div>
                        <p className="text-xs text-slate-500">Enhancement</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                        <p className="text-slate-600 dark:text-slate-400">Time Saved</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {curriculum.timeReduction}%
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
                        <p className="text-slate-600 dark:text-slate-400">Retention</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          +{curriculum.retentionImprovement}%
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="col-span-1">
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Techniques Tab */}
          <TabsContent value="techniques" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📚 Memory Techniques Usage</CardTitle>
                <CardDescription>Distribution of techniques used in your learning</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={techniquesUsed}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {techniquesUsed.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔮 Performance Predictions</CardTitle>
                <CardDescription>Estimated improvements based on current trajectory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performancePredictions.map((pred, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {pred.metric}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {pred.current}% → {pred.predicted}%
                        </span>
                        {pred.trend === "up" && (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Current</p>
                        <Progress value={pred.current} className="h-2" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Predicted (30 days)</p>
                        <Progress value={pred.predicted} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⏰ Estimated Mastery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span className="font-bold">42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    At current pace: <strong>18 days</strong> to full mastery
                  </p>
                  <p className="text-sm text-green-600">
                    With optimizations: <strong>12 days</strong> to full mastery
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Items */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>💡 Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="w-4 h-4 mr-2" />
              Update Memory Technique Preferences
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Optimize Your Study Schedule
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Start Memory-Enhanced Curriculum
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
