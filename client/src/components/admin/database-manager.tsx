import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, HardDrive, Users, BookOpen, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DatabaseStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  status: string;
  lastBackup?: string;
}

export function DatabaseManager() {
  const { data: stats, isLoading, error } = useQuery<DatabaseStats>({
    queryKey: ["/api/admin/db-stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Database Status
            </CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              {stats?.status || "Healthy"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Your database is connected and operational. All systems running normally.
          </p>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-green-600" />
              Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalEnrollments || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Database Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Database Operations</CardTitle>
          <CardDescription>Advanced database management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-sm mb-2">Database Connection</h3>
              <p className="text-xs text-gray-600 mb-3">View database connection details and configuration</p>
              <div className="flex gap-2">
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="outline">Neon Serverless</Badge>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-sm mb-2">Schema Management</h3>
              <p className="text-xs text-gray-600 mb-3">Manage database schema, tables, and relationships</p>
              <p className="text-xs text-gray-500 italic">Run: npm run db:push</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-sm mb-2">Data Maintenance</h3>
              <p className="text-xs text-gray-600 mb-3">Optimize database performance and cleanup</p>
              <Button size="sm" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables Info */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>Core tables and their purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">users</span>
              <span className="text-gray-600">User accounts and authentication</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">courses</span>
              <span className="text-gray-600">Course content and metadata</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">user_courses</span>
              <span className="text-gray-600">User course enrollments</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">modules & lessons</span>
              <span className="text-gray-600">Course content structure</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">certificates</span>
              <span className="text-gray-600">User achievements</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-sm">Database Safety</CardTitle>
              <CardDescription className="text-xs mt-1">
                Always backup before major operations. Use Drizzle ORM for schema changes - never write raw SQL migrations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
