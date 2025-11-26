import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PermissionsDemoPage() {
  const { data: metricsData } = useQuery({
    queryKey: ["/api/study-planner/metrics"],
  });

  const userRole = (metricsData as any)?.userRole || "student";

  const roleDescriptions: { [key: string]: { title: string; color: string; permissions: string[] } } = {
    student: {
      title: "Student",
      color: "bg-blue-50 dark:bg-blue-900/20",
      permissions: [
        "View study planner dashboard",
        "Generate AI study plans",
        "Track learning progress",
        "View basic metrics",
        "Export basic learning data",
      ],
    },
    premium_student: {
      title: "Premium Student",
      color: "bg-purple-50 dark:bg-purple-900/20",
      permissions: [
        "All student permissions +",
        "Export detailed learning data",
        "Access advanced analytics",
        "Create custom study plans",
        "Get priority support",
      ],
    },
    admin: {
      title: "Administrator",
      color: "bg-red-50 dark:bg-red-900/20",
      permissions: [
        "All permissions",
        "Access all system controls",
        "System configuration",
        "User management",
        "Restart modules",
        "Clear cache",
        "View all metrics",
        "Export system data",
        "Manage permissions",
      ],
    },
    support: {
      title: "Support Staff",
      color: "bg-green-50 dark:bg-green-900/20",
      permissions: [
        "View system metrics",
        "Restart modules",
        "Clear cache",
        "View alerts",
        "Export learning data",
      ],
    },
  };

  const roleInfo = roleDescriptions[userRole] || roleDescriptions.student;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Current Role */}
        <div className={`${roleInfo.color} rounded-lg p-8 mb-8 border border-slate-200 dark:border-slate-700`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Your Role
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Based on your account configuration
              </p>
            </div>
            <Badge className="px-4 py-2 text-lg" variant="secondary">
              {roleInfo.title}
            </Badge>
          </div>
        </div>

        {/* Permissions */}
        <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Your Permissions
          </h2>

          <div className="space-y-3">
            {roleInfo.permissions.map((permission, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">{permission}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Role Hierarchy */}
        <Card className="p-8 mt-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Role Hierarchy
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded text-center font-semibold text-blue-900 dark:text-blue-100">
                Student
              </div>
              <div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Basic access</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 rounded text-center font-semibold text-purple-900 dark:text-purple-100">
                Premium
              </div>
              <div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Enhanced features</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 px-4 py-2 bg-green-100 dark:bg-green-900/50 rounded text-center font-semibold text-green-900 dark:text-green-100">
                Support
              </div>
              <div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">System maintenance</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 px-4 py-2 bg-red-100 dark:bg-red-900/50 rounded text-center font-semibold text-red-900 dark:text-red-100">
                Admin
              </div>
              <div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Full access</div>
            </div>
          </div>
        </Card>

        {/* Permission Groups */}
        <Card className="p-8 mt-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Permission Groups
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                📊 Data Export
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Permission to export learning data in various formats
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                📈 Advanced Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access to detailed performance analysis and insights
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                ⚙️ System Controls
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ability to restart modules and manage system resources
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                👥 User Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Control over user accounts and permissions
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
