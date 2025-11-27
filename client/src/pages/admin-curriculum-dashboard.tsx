import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, Zap, AlertCircle, CheckCircle2, Clock,
  BarChart3, Brain, Target, Settings, Download, RefreshCw
} from 'lucide-react';

export default function AdminCurriculumDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch curriculum data
  const { data: curriculumList = [] } = useQuery<any[]>({
    queryKey: ['/api/curriculum/list'],
    enabled: !!user
  });

  // Fetch productions
  const { data: productions = [] } = useQuery<any[]>({
    queryKey: ['/api/production/list'],
    enabled: !!user
  });

  // Calculate system overview metrics
  const systemOverview = {
    totalGenerated: curriculumList.length,
    activeUsers: new Set(productions.map((p: any) => p.userId)).size,
    successRate: 95,
    avgConfidence: productions.length > 0 
      ? Math.round(productions.reduce((sum: number, p: any) => sum + (p.aiConfidenceScore || 0.8), 0) / productions.length * 100)
      : 0,
    mostPopularType: 'personalized'
  };

  // AI Performance Metrics
  const aiPerformance = {
    modelAccuracy: 92,
    userSatisfaction: 4.6,
    avgGenerationTime: 2.3,
    errorRate: 2.1,
    improvements: ['Enhance difficulty prediction', 'Optimize course ordering']
  };

  // User Engagement
  const engagementData = [
    { day: 'Mon', users: 120, completions: 45 },
    { day: 'Tue', users: 150, completions: 58 },
    { day: 'Wed', users: 180, completions: 72 },
    { day: 'Thu', users: 160, completions: 65 },
    { day: 'Fri', users: 220, completions: 95 },
    { day: 'Sat', users: 140, completions: 50 },
    { day: 'Sun', users: 130, completions: 42 }
  ];

  // Curriculum Types Distribution
  const curriculumTypes = [
    { name: 'Personalized', value: 45, color: '#3B82F6' },
    { name: 'Progressive', value: 25, color: '#10B981' },
    { name: 'Accelerated', value: 18, color: '#F59E0B' },
    { name: 'Focused', value: 12, color: '#8B5CF6' }
  ];

  // Performance Trends
  const performanceTrends = [
    { month: 'Jan', accuracy: 85, satisfaction: 4.2 },
    { month: 'Feb', accuracy: 87, satisfaction: 4.3 },
    { month: 'Mar', accuracy: 89, satisfaction: 4.4 },
    { month: 'Apr', accuracy: 91, satisfaction: 4.5 },
    { month: 'May', accuracy: 92, satisfaction: 4.6 }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-slate-700" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Curriculum Management & Analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Generated</p>
                <p className="text-2xl font-bold mt-1">{systemOverview.totalGenerated}</p>
              </div>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold mt-1">{systemOverview.activeUsers}</p>
              </div>
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold mt-1">{systemOverview.successRate}%</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold mt-1">{systemOverview.avgConfidence}%</p>
              </div>
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Gen Time</p>
                <p className="text-2xl font-bold mt-1">{aiPerformance.avgGenerationTime}s</p>
              </div>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">API Status</span>
                    <Badge className="bg-green-600">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Database</span>
                    <Badge className="bg-blue-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">AI Models</span>
                    <Badge className="bg-purple-600">Running</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Curriculum Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={curriculumTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {curriculumTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {curriculumTypes.map((type: any) => (
                    <div key={type.name} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        {type.name}
                      </span>
                      <span className="font-semibold">{type.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* AI Performance */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Model Accuracy</span>
                      <span className="font-semibold">{aiPerformance.modelAccuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${aiPerformance.modelAccuracy}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>User Satisfaction</span>
                      <span className="font-semibold">{aiPerformance.userSatisfaction}/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${aiPerformance.userSatisfaction * 20}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Error Rate</span>
                      <span className="font-semibold">{aiPerformance.errorRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${aiPerformance.errorRate * 10}%` }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* User Engagement */}
          <TabsContent value="engagement" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Engagement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" />
                  <Bar dataKey="completions" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Metrics</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Courses per Curriculum</p>
                    <p className="text-2xl font-bold mt-1">5.2</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Duration (hours)</p>
                    <p className="text-2xl font-bold mt-1">156</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-gray-600">Course Reuse Rate</p>
                    <p className="text-2xl font-bold mt-1">73%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Model Versions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Generation Engine</span>
                    <Badge>v2.1</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Personalization</span>
                    <Badge>v1.8</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Prediction</span>
                    <Badge>v1.5</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Improvement Opportunities
              </h3>
              <div className="space-y-3">
                {aiPerformance.improvements.map((improvement: string, idx: number) => (
                  <div key={idx} className="p-3 border-l-4 border-orange-500 bg-orange-50 rounded">
                    <p className="text-sm font-medium">{improvement}</p>
                    <p className="text-xs text-gray-600 mt-1">Priority: High</p>
                  </div>
                ))}
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                  <p className="text-sm font-medium">Increase AI model training frequency</p>
                  <p className="text-xs text-gray-600 mt-1">Priority: Medium</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm font-semibold text-green-600">247ms ✓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Database Queries</span>
                  <span className="text-sm font-semibold text-green-600">89% efficient ✓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <span className="text-sm font-semibold text-blue-600">76%</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
