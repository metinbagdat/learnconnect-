import { RealTimeMonitorDashboard } from "@/components/real-time-monitor-dashboard";

export function MonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto">
        <RealTimeMonitorDashboard />
      </div>
    </div>
  );
}
