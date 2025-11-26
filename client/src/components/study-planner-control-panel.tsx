import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Activity, RefreshCw, Zap, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ModuleHealth {
  status: 'healthy' | 'degraded' | 'failed';
  responseTime: number;
  lastCheck: number;
}

interface HealthMetrics {
  responseTime: { [key: string]: number[] };
  errorRates: { [key: string]: number };
  userEngagement: { [key: string]: number };
  systemLoad: number;
}

interface Alert {
  type: 'warning' | 'critical';
  module: string;
  message: string;
  timestamp: number;
}

export function StudyPlannerControlPanel() {
  const [health, setHealth] = useState<{ [key: string]: ModuleHealth }>({});
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemLoad, setSystemLoad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const modules = [
    { key: 'plan_generation', name: '📊 Plan Generation', actions: ['Restart', 'Configure', 'Test'] },
    { key: 'schedule_management', name: '📅 Schedule Management', actions: ['Refresh', 'Optimize', 'Clear Cache'] },
    { key: 'progress_tracking', name: '📈 Progress Tracking', actions: ['Sync Data', 'Recalculate', 'Export'] },
    { key: 'motivation_engine', name: '💪 Motivation Engine', actions: ['Refresh', 'Update Messages'] },
    { key: 'analytics_engine', name: '📈 Analytics Engine', actions: ['Recalculate', 'Export'] },
  ];

  const fetchHealthStatus = async () => {
    setLoading(true);
    try {
      const [healthRes, metricsRes, alertsRes] = await Promise.all([
        apiRequest('GET', '/api/study-planner/health'),
        apiRequest('GET', '/api/study-planner/metrics'),
        apiRequest('GET', '/api/study-planner/alerts'),
      ]);

      const healthData = await healthRes.json();
      const metricsData = await metricsRes.json();
      const alertsData = await alertsRes.json();

      setHealth(healthData.status || {});
      setMetrics(metricsData);
      setSystemLoad(metricsData.systemLoad || 0);
      setAlerts(alertsData.alerts || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAverageResponseTime = (moduleName: string) => {
    if (!metrics?.responseTime[moduleName] || metrics.responseTime[moduleName].length === 0) {
      return 0;
    }
    const times = metrics.responseTime[moduleName];
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  const handleModuleAction = async (module: string, action: string) => {
    console.log(`Action: ${action} on module: ${module}`);
  };

  const handleSystemReset = async () => {
    if (confirm('Are you sure you want to perform an emergency reset?')) {
      console.log('Emergency reset initiated');
    }
  };

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">🎛️ Study Planner Control Center</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${systemLoad > 80 ? 'bg-red-500' : systemLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="text-sm font-medium">System {systemLoad > 80 ? 'High Load' : systemLoad > 50 ? 'Moderate Load' : 'Active'}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-900">Active Alerts ({alerts.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.slice(0, 5).map((alert, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${alert.type === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <strong>{alert.module}:</strong> {alert.message}
              </div>
            ))}
            {alerts.length > 5 && <div className="text-sm text-gray-600">+{alerts.length - 5} more alerts</div>}
          </CardContent>
        </Card>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{getAverageResponseTime('plan_generation')}ms</div>
              <div className="text-sm text-gray-600 mt-1">Avg Response Time</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{(metrics?.errorRates['plan_generation'] || 0).toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">Error Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{Object.keys(metrics?.userEngagement || {}).length}</div>
              <div className="text-sm text-gray-600 mt-1">Active Modules</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{systemLoad.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">System Load</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card key={module.key} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{module.name}</CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health[module.key]?.status || 'unknown')}`}>
                  {health[module.key]?.status || 'unknown'}
                </div>
              </div>
              {health[module.key] && (
                <div className="text-xs text-gray-500 mt-1">Response: {health[module.key].responseTime}ms</div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {module.actions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleModuleAction(module.key, action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Controls */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            ⚙️ System Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={fetchHealthStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSystemReset}
            >
              Emergency Reset
            </Button>
          </div>
          <div className="text-xs text-gray-600 text-center pt-2 border-t">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
