import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Brain,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Download,
  Filter,
  Settings,
} from "lucide-react";

interface TechniqueData {
  name: string;
  effectiveness: number;
  userCount: number;
  trend: number;
}

interface UserMetric {
  name: string;
  value: number;
  change: number;
  status: "up" | "down" | "stable";
}

export default function AdminCognitiveDashboard() {
  const [dateRange, setDateRange] = useState("week");

  // System performance data
  const systemPerformance = [
    { metric: "API Response Time", value: "145ms", status: "excellent" },
    { metric: "System Uptime", value: "99.98%", status: "excellent" },
    { metric: "Active Users", value: "2,847", status: "excellent" },
    { metric: "Database Performance", value: "98%", status: "excellent" },
  ];

  // User engagement data
  const userEngagementTrend = [
    { day: "Mon", activeUsers: 450, sessionsPerUser: 2.3, completionRate: 78 },
    { day: "Tue", activeUsers: 520, sessionsPerUser: 2.5, completionRate: 82 },
    { day: "Wed", activeUsers: 480, sessionsPerUser: 2.4, completionRate: 80 },
    { day: "Thu", activeUsers: 610, sessionsPerUser: 2.8, completionRate: 85 },
    { day: "Fri", activeUsers: 720, sessionsPerUser: 3.1, completionRate: 88 },
    { day: "Sat", activeUsers: 540, sessionsPerUser: 2.6, completionRate: 83 },
    { day: "Sun", activeUsers: 390, sessionsPerUser: 2.1, completionRate: 75 },
  ];

  // Technique effectiveness
  const techniqueEffectiveness: TechniqueData[] = [
    { name: "Spaced Repetition", effectiveness: 0.91, userCount: 2340, trend: 12 },
    { name: "Method of Loci", effectiveness: 0.88, userCount: 1840, trend: 18 },
    { name: "Mnemonic Generation", effectiveness: 0.82, userCount: 1560, trend: 9 },
    { name: "Active Recall", effectiveness: 0.85, userCount: 1920, trend: 15 },
    { name: "Chunking", effectiveness: 0.79, userCount: 1280, trend: 6 },
    { name: "Memory Palace", effectiveness: 0.87, userCount: 1650, trend: 22 },
  ];

  // Cognitive improvements
  const cognitiveImprovements = [
    {
      metric: "Memory Capacity Improvement",
      value: 38,
      userCount: 2847,
      trend: "up",
    },
    {
      metric: "Learning Efficiency Gain",
      value: 45,
      userCount: 2847,
      trend: "up",
    },
    {
      metric: "Retention Rate Improvement",
      value: 42,
      userCount: 2847,
      trend: "up",
    },
    {
      metric: "Study Time Reduction",
      value: 36,
      userCount: 2847,
      trend: "up",
    },
  ];

  // Integration analytics
  const integrationAnalytics = [
    { component: "Spaced Repetition Engine", usage: 94, users: 2340 },
    { component: "Memory Technique Integration", usage: 87, users: 2100 },
    { component: "Cognitive Assessment", usage: 76, users: 1920 },
    { component: "Memory Palace Generator", usage: 82, users: 1850 },
    { component: "Performance Tracker", usage: 91, users: 2250 },
  ];

  const successStories = [
    {
      user: "Ahmad M.",
      improvement: "+58% retention",
      timeReduction: "42% faster",
      technique: "Method of Loci",
    },
    {
      user: "Fatima S.",
      improvement: "+52% retention",
      timeReduction: "38% faster",
      technique: "Spaced Repetition",
    },
    {
      user: "Hassan K.",
      improvement: "+48% retention",
      timeReduction: "35% faster",
      technique: "Active Recall",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Admin Cognitive Analytics Dashboard
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              System-wide cognitive feature performance and user engagement analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* System Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {systemPerformance.map((item, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="engagement">
              <Users className="w-4 h-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="techniques">
              <Brain className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
            <TabsTrigger value="improvements">
              <TrendingUp className="w-4 h-4 mr-2" />
              Improvements
            </TabsTrigger>
            <TabsTrigger value="integration">
              <Zap className="w-4 h-4 mr-2" />
              Integration
            </TabsTrigger>
          </TabsList>

          {/* User Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Trends</CardTitle>
                <CardDescription>
                  Weekly active users, sessions per user, and completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userEngagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#8b5cf6"
                      name="Active Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="sessionsPerUser"
                      stroke="#06b6d4"
                      name="Sessions/User (×100)"
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#10b981"
                      name="Completion Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Daily Active Users
                    </span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Avg Sessions/User
                    </span>
                    <span className="font-bold">2.6</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Session Completion Rate
                    </span>
                    <span className="font-bold text-green-600">82%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Avg Session Duration
                    </span>
                    <span className="font-bold">28 min</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Users
                    </span>
                    <span className="font-bold">14,230</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      New This Week
                    </span>
                    <span className="font-bold text-blue-600">+342</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Retention Rate
                    </span>
                    <span className="font-bold text-green-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Growth Rate (MoM)
                    </span>
                    <span className="font-bold">+18%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Technique Effectiveness Tab */}
          <TabsContent value="techniques" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Memory Technique Effectiveness Analysis</CardTitle>
                <CardDescription>
                  Performance metrics for each memory technique across user base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {techniqueEffectiveness.map((tech, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {tech.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Used by {tech.userCount.toLocaleString()} users
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(tech.effectiveness * 100)}%
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            ↑ {tech.trend}% trend
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-2">
                        <div
                          className="bg-green-600 h-2 rounded"
                          style={{ width: `${tech.effectiveness * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cognitive Improvements Tab */}
          <TabsContent value="improvements" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {cognitiveImprovements.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-sm">{item.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      +{item.value}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Across {item.userCount.toLocaleString()} users
                    </p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Consistently improving</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Notable improvements from active users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {successStories.map((story, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 space-y-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {story.user}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Primary technique: {story.technique}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-700 dark:text-green-300">
                          Success
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Retention</span>
                          <p className="font-bold text-green-600">{story.improvement}</p>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Time Saved</span>
                          <p className="font-bold text-green-600">{story.timeReduction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Analytics Tab */}
          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Integration Usage</CardTitle>
                <CardDescription>
                  Adoption rates for cognitive system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={integrationAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="component" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="#8b5cf6" name="Usage %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Avg Response Time
                    </span>
                    <span className="font-bold">145ms</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Error Rate
                    </span>
                    <span className="font-bold text-green-600">0.03%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Requests/Second
                    </span>
                    <span className="font-bold">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      System Uptime
                    </span>
                    <span className="font-bold text-green-600">99.98%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Query Performance
                    </span>
                    <span className="font-bold">98%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Storage Used
                    </span>
                    <span className="font-bold">45.2 GB</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">
                      Connections Active
                    </span>
                    <span className="font-bold">324</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Backup Status
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Synced
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Cognitive Engine
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ● Operational
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                ML Models
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ● All Models Active
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Data Synchronization
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ● Synced
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
