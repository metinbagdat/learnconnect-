import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, AlertCircle, Lightbulb, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function InteractionTracking() {
  // Fetch metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/ai/interactions/metrics"],
  });

  // Fetch engagement
  const { data: engagement } = useQuery({
    queryKey: ["/api/ai/interactions/engagement"],
  });

  // Fetch insights
  const { data: insights } = useQuery({
    queryKey: ["/api/ai/interactions/insights"],
  });

  // Fetch history
  const { data: history } = useQuery({
    queryKey: ["/api/ai/interactions/history"],
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            AI Interaction Tracking
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor your AI interactions and learning patterns</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Interactions</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{metrics?.totalInteractions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {metrics?.averageResponseTime || 0}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {metrics?.successRate || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">Engagement Level</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {engagement?.score || 0}/100
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4">
            {/* Engagement Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {engagement?.score || 0}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                          style={{ width: `${engagement?.score || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Level</p>
                      <p className={`text-lg font-bold capitalize ${
                        engagement?.level === "excellent"
                          ? "text-green-600"
                          : engagement?.level === "high"
                            ? "text-blue-600"
                            : "text-yellow-600"
                      }`}>
                        {engagement?.level}
                      </p>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  <div className="space-y-2 pt-4 border-t">
                    {engagement?.factors?.map((factor) => (
                      <div key={factor.factor} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {factor.factor}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded">
                            <div
                              className="h-full bg-blue-600 rounded"
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{factor.score}/25</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules Breakdown */}
            {metrics?.interactionsByModule && (
              <Card>
                <CardHeader>
                  <CardTitle>Interactions by Module</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(metrics.interactionsByModule).map(([module, count]) => ({
                        module,
                        count,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="module" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.topActions?.map((action) => (
                  <div key={action.action} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {action.action}
                    </span>
                    <span className="text-lg font-bold text-blue-600">{action.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="space-y-4">
            {/* Insights */}
            {insights?.insights && insights.insights.length > 0 && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                    <Lightbulb className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span className="text-blue-900 dark:text-blue-200">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {insights?.recommendations && insights.recommendations.length > 0 && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-300">
                    <TrendingUp className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-green-900 dark:text-green-200">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Anomalies */}
            {insights?.anomalies && insights.anomalies.length > 0 && (
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.anomalies.map((anomaly, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-red-600 dark:text-red-400">!</span>
                        <span className="text-red-900 dark:text-red-200">{anomaly}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history?.slice(0, 20).map((interaction: any) => (
                  <div
                    key={interaction.interactionId}
                    className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {interaction.module} - {interaction.action}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {new Date(interaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                        {interaction.responseTime}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
