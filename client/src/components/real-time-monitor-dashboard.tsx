import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Download, Pause, Play } from "lucide-react";

interface MetricsData {
  planGeneration: {
    successRate: number;
    avgTime: number;
    queue: number;
    operationsCount: number;
  };
  scheduleManagement: {
    activeSchedules: number;
    conflicts: number;
    optimizationScore: number;
  };
  progressTracking: {
    sessionsTracked: number;
    averageProgress: number;
    activeGoals: number;
  };
  motivationEngine: {
    messagesDelivered: number;
    engagement: number;
  };
  analyticsEngine: {
    dataPointsProcessed: number;
    metricsComputed: number;
  };
  systemHealth: {
    cpuLoad: number;
    memoryUsage: number;
    errorRate: number;
    uptime: number;
  };
  userEngagement: {
    activeUsers: number;
    avgSessionTime: number;
    completionRate: number;
  };
}

interface Alert {
  id: string;
  type: "warning" | "critical" | "info";
  module: string;
  message: string;
  timestamp: string;
}

export function RealTimeMonitorDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  const { data: metricsSnapshot, isLoading } = useQuery({
    queryKey: ["/api/study-planner/metrics"],
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const metrics = (metricsSnapshot as any)?.data as MetricsData | undefined;
  const alerts = (metricsSnapshot as any)?.alerts as Alert[] | undefined;

  useEffect(() => {
    if (metrics) {
      setChartData((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          planGeneration: metrics.planGeneration.successRate,
          scheduleManagement: metrics.scheduleManagement.optimizationScore,
          userEngagement: metrics.userEngagement.completionRate,
          systemHealth: 100 - metrics.systemHealth.errorRate,
        },
      ].slice(-20)); // Keep last 20 data points
    }
  }, [metrics]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (value: number, threshold: number = 70) => {
    if (value >= threshold) return "text-green-600";
    if (value >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📊</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Real-Time Monitoring
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Live metrics from Study Planner Control System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            data-testid="button-toggle-auto-refresh"
          >
            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {autoRefresh ? "Pause" : "Resume"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            data-testid="button-refresh-metrics"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-export-metrics"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Plan Generation */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            📋 Plan Generation
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              Success Rate:{" "}
              <span className={`font-bold ${getStatusColor(metrics?.planGeneration.successRate || 0)}`}>
                {metrics?.planGeneration.successRate || 0}%
              </span>
            </div>
            <div>
              Avg Time: <span className="font-bold">{metrics?.planGeneration.avgTime || 0}ms</span>
            </div>
            <div>
              Queue: <span className="font-bold">{metrics?.planGeneration.queue || 0}</span>
            </div>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            📅 Schedule Management
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              Active Schedules:{" "}
              <span className="font-bold">{metrics?.scheduleManagement.activeSchedules || 0}</span>
            </div>
            <div>
              Conflicts: <span className="font-bold text-red-600">{metrics?.scheduleManagement.conflicts || 0}</span>
            </div>
            <div>
              Optimization:{" "}
              <span className={`font-bold ${getStatusColor(metrics?.scheduleManagement.optimizationScore || 0)}`}>
                {metrics?.scheduleManagement.optimizationScore || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            👥 User Engagement
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              Active Users:{" "}
              <span className="font-bold">{metrics?.userEngagement.activeUsers || 0}</span>
            </div>
            <div>
              Avg Session:{" "}
              <span className="font-bold">{metrics?.userEngagement.avgSessionTime || 0}m</span>
            </div>
            <div>
              Completion:{" "}
              <span className={`font-bold ${getStatusColor(metrics?.userEngagement.completionRate || 0)}`}>
                {metrics?.userEngagement.completionRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            ⚙️ System Health
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              CPU Load: <span className="font-bold">{metrics?.systemHealth.cpuLoad || 0}%</span>
            </div>
            <div>
              Memory: <span className="font-bold">{metrics?.systemHealth.memoryUsage || 0}%</span>
            </div>
            <div>
              Uptime:{" "}
              <span className="font-bold">
                {formatUptime(metrics?.systemHealth.uptime || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="planGeneration"
                stroke="#3b82f6"
                name="Plan Generation"
              />
              <Line
                type="monotone"
                dataKey="scheduleManagement"
                stroke="#8b5cf6"
                name="Schedule Mgmt"
              />
              <Line
                type="monotone"
                dataKey="userEngagement"
                stroke="#10b981"
                name="User Engagement"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Module Health */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Module Health Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Plan Gen", value: metrics?.planGeneration.successRate || 0 },
                { name: "Schedule", value: metrics?.scheduleManagement.optimizationScore || 0 },
                { name: "Progress", value: metrics?.progressTracking.averageProgress || 0 },
                { name: "Motivation", value: metrics?.motivationEngine.engagement || 0 },
                { name: "Analytics", value: 85 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Active Alerts ({alerts?.length || 0})
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded flex items-start gap-3 ${
                  alert.type === "critical"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.type === "critical" ? "text-red-600" : "text-yellow-600"
                  }`}
                />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {alert.module}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">{alert.message}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
              ✅ No active alerts - System running normally
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <p>📊 Real-time data updates every 5 seconds when auto-refresh is enabled</p>
        <p>🟢 Green: Healthy (≥70%) | 🟡 Yellow: Warning (50-69%) | 🔴 Red: Critical (&lt;50%)</p>
      </div>
    </div>
  );
}
