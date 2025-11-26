import { useState } from "react";
import { RealTimeMonitorDashboard } from "@/components/real-time-monitor-dashboard";
import { PerformanceAnalytics } from "@/components/performance-analytics";
import { UserInsights } from "@/components/user-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">📊 Real-Time Metrics</TabsTrigger>
            <TabsTrigger value="analytics">📈 Performance Analytics</TabsTrigger>
            <TabsTrigger value="insights">👥 User Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <RealTimeMonitorDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <PerformanceAnalytics />
          </TabsContent>

          <TabsContent value="insights">
            <UserInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
