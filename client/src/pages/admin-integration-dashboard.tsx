import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Users, Zap, Clock } from 'lucide-react';

interface SystemHealth {
  integrationRate: number;
  averageIntegrationTime: number;
  errorRates: Record<string, number>;
  systemUptime: number;
}

interface IntegrationMetrics {
  curriculumSuccess: number;
  studyPlanSuccess: number;
  assignmentSuccess: number;
  targetSuccess: number;
  crossModuleDependencies: number;
}

interface ModulePerformance {
  module: string;
  successRate: number;
  avgProcessingTime: number;
  errorCount: number;
}

interface UserEngagement {
  activeUsers: number;
  completedIntegrations: number;
  averageCoursesPerUser: number;
  averageSessionDuration: number;
}

interface AIEffectiveness {
  curriculumAccuracy: number;
  recommendationQuality: number;
  pathOptimizationScore: number;
  userSatisfactionScore: number;
}

export default function AdminIntegrationDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Load integration analytics
  const { data: analytics = null, isLoading } = useQuery({
    queryKey: ['/api/dashboard/admin'],
  });

  // Mock data for visualization (replace with real data from API)
  const systemHealthData = {
    integrationRate: 87.5,
    averageIntegrationTime: 2340,
    errorRates: { curriculum: 2.1, studyPlan: 1.8, assignment: 3.2, targets: 1.5 },
    systemUptime: 99.7,
  };

  const integrationMetricsData = {
    curriculumSuccess: 95.2,
    studyPlanSuccess: 92.8,
    assignmentSuccess: 94.1,
    targetSuccess: 93.5,
    crossModuleDependencies: 987,
  };

  const modulePerformanceData = [
    { module: 'Curriculum', successRate: 95.2, avgProcessingTime: 450, errorCount: 8 },
    { module: 'Study Planner', successRate: 92.8, avgProcessingTime: 380, errorCount: 12 },
    { module: 'Assignment', successRate: 94.1, avgProcessingTime: 520, errorCount: 14 },
    { module: 'Targets', successRate: 93.5, avgProcessingTime: 290, errorCount: 6 },
    { module: 'AI Director', successRate: 91.2, avgProcessingTime: 680, errorCount: 18 },
  ];

  const userEngagementData = {
    activeUsers: 2847,
    completedIntegrations: 2481,
    averageCoursesPerUser: 3.2,
    averageSessionDuration: 42,
  };

  const aiEffectivenessData = {
    curriculumAccuracy: 87.5,
    recommendationQuality: 84.2,
    pathOptimizationScore: 82.1,
    userSatisfactionScore: 88.3,
  };

  const integrationTimelineData = [
    { time: '00:00', integrations: 120, errors: 3 },
    { time: '04:00', integrations: 95, errors: 2 },
    { time: '08:00', integrations: 340, errors: 8 },
    { time: '12:00', integrations: 520, errors: 12 },
    { time: '16:00', integrations: 480, errors: 10 },
    { time: '20:00', integrations: 380, errors: 7 },
  ];

  const moduleDistributionData = [
    { name: 'Curriculum', value: 25, color: '#3b82f6' },
    { name: 'Study Plan', value: 22, color: '#10b981' },
    { name: 'Assignment', value: 28, color: '#f59e0b' },
    { name: 'Targets', value: 15, color: '#8b5cf6' },
    { name: 'AI Director', value: 10, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Integration Dashboard</h1>
        <p className="text-sm opacity-70 mt-1">System-wide integration analytics and performance monitoring</p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Integration Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealthData.integrationRate}%</div>
            <p className="text-xs opacity-70 mt-1">of users fully integrated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Avg Integration Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(systemHealthData.averageIntegrationTime / 60)}s</div>
            <p className="text-xs opacity-70 mt-1">seconds per user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEngagementData.activeUsers.toLocaleString()}</div>
            <p className="text-xs opacity-70 mt-1">users in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealthData.systemUptime}%</div>
            <p className="text-xs opacity-70 mt-1">availability</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationMetricsData.curriculumSuccess}%</div>
            <Badge className="mt-2 bg-green-100 text-green-800">Success Rate</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationMetricsData.studyPlanSuccess}%</div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">Success Rate</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationMetricsData.assignmentSuccess}%</div>
            <Badge className="mt-2 bg-amber-100 text-amber-800">Success Rate</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationMetricsData.targetSuccess}%</div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">Success Rate</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationMetricsData.crossModuleDependencies}</div>
            <Badge className="mt-2 bg-pink-100 text-pink-800">Active</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Module Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Module Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modulePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="successRate" fill="#10b981" name="Success Rate %" />
              <Bar yAxisId="right" dataKey="errorCount" fill="#ef4444" name="Error Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Integration Timeline and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Timeline (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={integrationTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="integrations" stroke="#3b82f6" name="Integrations" />
                <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" name="Errors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={moduleDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moduleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium opacity-70">Active Users</div>
              <div className="text-2xl font-bold mt-1">{userEngagementData.activeUsers.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium opacity-70">Completed Integrations</div>
              <div className="text-2xl font-bold mt-1">{userEngagementData.completedIntegrations.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium opacity-70">Avg Courses/User</div>
              <div className="text-2xl font-bold mt-1">{userEngagementData.averageCoursesPerUser}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium opacity-70">Avg Session Duration</div>
              <div className="text-2xl font-bold mt-1">{userEngagementData.averageSessionDuration}m</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Effectiveness */}
      <Card>
        <CardHeader>
          <CardTitle>AI Effectiveness Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Curriculum Accuracy</span>
                <span className="text-lg font-bold">{aiEffectivenessData.curriculumAccuracy}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${aiEffectivenessData.curriculumAccuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recommendation Quality</span>
                <span className="text-lg font-bold">{aiEffectivenessData.recommendationQuality}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${aiEffectivenessData.recommendationQuality}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Path Optimization</span>
                <span className="text-lg font-bold">{aiEffectivenessData.pathOptimizationScore}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${aiEffectivenessData.pathOptimizationScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">User Satisfaction</span>
                <span className="text-lg font-bold">{aiEffectivenessData.userSatisfactionScore}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${aiEffectivenessData.userSatisfactionScore}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Integration Error Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(systemHealthData.errorRates).map(([module, rate]) => (
              <div key={module} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{module}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (rate as number) > 3 ? 'bg-red-500' : (rate as number) > 2 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((rate as number) * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-12">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
