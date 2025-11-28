import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/consolidated-language-context';
import { 
  RefreshCw, BookOpen, Calendar, FileText, Target, Zap, 
  CheckCircle, AlertCircle, Clock, TrendingUp 
} from 'lucide-react';

interface IntegrationState {
  curriculumIntegrated: boolean;
  studyPlanGenerated: boolean;
  assignmentsCreated: boolean;
  targetsUpdated: boolean;
  aiRecommendationsGenerated: boolean;
}

interface ModuleData {
  curriculum?: any;
  studyPlan?: any;
  assignments?: any[];
  targets?: any[];
  aiRecommendations?: any;
}

export default function IntegratedDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [integrationState, setIntegrationState] = useState<IntegrationState>({
    curriculumIntegrated: false,
    studyPlanGenerated: false,
    assignmentsCreated: false,
    targetsUpdated: false,
    aiRecommendationsGenerated: false,
  });
  const [moduleData, setModuleData] = useState<ModuleData>({});

  // Load integration data
  const { data: integrationData = null, isLoading: loadingIntegration } = useQuery({
    queryKey: ['/api/integration/status', user?.id],
    enabled: !!user?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Load curriculum data
  const { data: curriculumData = null } = useQuery({
    queryKey: ['/api/forms/curricula', user?.id],
    enabled: !!user?.id,
  });

  // Load assignments
  const { data: assignmentsData = [] } = useQuery({
    queryKey: ['/api/assignments', user?.id],
    enabled: !!user?.id,
  });

  // Load study plan (using daily tasks as proxy)
  const { data: tasksData = [] } = useQuery({
    queryKey: ['/api/user/daily-tasks', user?.id],
    enabled: !!user?.id,
  });

  // Load enrolled courses
  const { data: coursesData = [] } = useQuery({
    queryKey: ['/api/user/courses', user?.id],
    enabled: !!user?.id,
  });

  // Update module data when queries complete
  useEffect(() => {
    setModuleData({
      curriculum: curriculumData,
      assignments: assignmentsData,
      studyPlan: { tasks: tasksData },
      aiRecommendations: integrationData?.aiRecommendations,
    });

    if (integrationData) {
      setIntegrationState({
        curriculumIntegrated: integrationData.curriculumIntegrated || false,
        studyPlanGenerated: integrationData.studyPlanGenerated || false,
        assignmentsCreated: integrationData.assignmentsCreated || false,
        targetsUpdated: integrationData.targetsUpdated || false,
        aiRecommendationsGenerated: integrationData.aiRecommendationsGenerated || false,
      });
    }
  }, [integrationData, curriculumData, assignmentsData, tasksData]);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/integration/enroll-and-integrate', {
        courseIds: coursesData.map((c: any) => c.courseId),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forms/curricula'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
    },
  });

  const getNextDueDate = () => {
    if (!moduleData.assignments || moduleData.assignments.length === 0) return 'N/A';
    const sorted = [...moduleData.assignments].sort((a, b) => 
      new Date(a.dueDate || Date.now()).getTime() - new Date(b.dueDate || Date.now()).getTime()
    );
    return sorted[0]?.dueDate ? new Date(sorted[0].dueDate).toLocaleDateString() : 'N/A';
  };

  const calculateWeeklyHours = () => {
    const totalTasks = moduleData.studyPlan?.tasks?.length || 0;
    const durationMinutes = totalTasks * 60;
    return Math.round(durationMinutes / 60);
  };

  const calculateTargetProgress = () => {
    if (!moduleData.assignments || moduleData.assignments.length === 0) return 0;
    const completed = moduleData.assignments.filter((a: any) => a.status === 'completed').length;
    return Math.round((completed / moduleData.assignments.length) * 100);
  };

  if (loadingIntegration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Integration Status Header */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            🔄 Integrated Learning Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${integrationState.curriculumIntegrated ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div className="text-sm">
                <div className="font-semibold">Curriculum</div>
                <div className="text-xs opacity-70">{integrationState.curriculumIntegrated ? '✅ Synced' : '🔄 Pending'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${integrationState.studyPlanGenerated ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div className="text-sm">
                <div className="font-semibold">Study Plan</div>
                <div className="text-xs opacity-70">{integrationState.studyPlanGenerated ? '✅ Active' : '🔄 Generating'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${integrationState.assignmentsCreated ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div className="text-sm">
                <div className="font-semibold">Assignments</div>
                <div className="text-xs opacity-70">{integrationState.assignmentsCreated ? '✅ Created' : '🔄 Creating'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${integrationState.targetsUpdated ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div className="text-sm">
                <div className="font-semibold">Targets</div>
                <div className="text-xs opacity-70">{integrationState.targetsUpdated ? '✅ Updated' : '🔄 Pending'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${integrationState.aiRecommendationsGenerated ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div className="text-sm">
                <div className="font-semibold">AI</div>
                <div className="text-xs opacity-70">{integrationState.aiRecommendationsGenerated ? '✅ Ready' : '🔄 Analyzing'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Courses ({coursesData.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {coursesData.length === 0 ? (
              <p className="text-sm opacity-70">No courses enrolled</p>
            ) : (
              coursesData.slice(0, 5).map((course: any) => (
                <div key={course.id} className="p-2 border rounded bg-secondary/20">
                  <div className="font-semibold text-sm">{course.course?.titleEn}</div>
                  <div className="text-xs opacity-70 flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.progress}%
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Study Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Study Plan Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{moduleData.studyPlan?.tasks?.length || 0}</div>
                <div className="text-xs opacity-70">Study Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{calculateWeeklyHours()}h</div>
                <div className="text-xs opacity-70">Weekly Commitment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-semibold">{moduleData.assignments?.length || 0} total</div>
              <div className="text-xs opacity-70">Next due: {getNextDueDate()}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {moduleData.assignments && moduleData.assignments.length > 0 && (
                <>
                  <div className="p-2 bg-green-500/20 rounded">
                    <div className="font-semibold">
                      {moduleData.assignments.filter((a: any) => a.status === 'completed').length}
                    </div>
                    <div className="opacity-70">Completed</div>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded">
                    <div className="font-semibold">
                      {moduleData.assignments.filter((a: any) => a.status !== 'completed').length}
                    </div>
                    <div className="opacity-70">Pending</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Target Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Learning Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">{calculateTargetProgress()}%</div>
              <div className="text-sm opacity-70">Overall Progress</div>
              <div className="mt-4 w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${calculateTargetProgress()}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Learning Director
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 bg-blue-500/10 border border-blue-200 rounded">
              <div className="text-sm font-semibold">AI Confidence</div>
              <div className="text-2xl font-bold">
                {moduleData.aiRecommendations?.confidence || '75-95'}%
              </div>
              <div className="text-xs opacity-70 mt-2">
                {integrationState.aiRecommendationsGenerated 
                  ? '✅ Recommendations Ready' 
                  : '🔄 Analyzing...'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Integration Status:</span>
              <Badge variant={Object.values(integrationState).every(v => v) ? "default" : "secondary"}>
                {Object.values(integrationState).filter(v => v).length}/5 modules
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Last Updated:</span>
              <span className="text-xs opacity-70">Just now</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Actions */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>⚙️ Integration Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {syncMutation.isPending ? 'Syncing...' : 'Sync All Modules'}
            </Button>
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Regenerate Curriculum
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Update Study Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
