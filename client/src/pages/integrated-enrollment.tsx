import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { BookOpen, Zap, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface CourseOption {
  id: number;
  titleEn: string;
  category: string;
  durationHours?: number;
}

interface IntegrationPreview {
  curriculum: { newCourses: number; totalWeeks: number };
  studyPlan: { weeklyHours: number; totalHours: number };
  assignments: { totalAssignments: number; weeklyAssignments: number };
}

interface AIRecommendation {
  title: string;
  description: string;
  confidence: number;
  reason: string;
}

export default function IntegratedEnrollment() {
  const { user } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [integrationSettings, setIntegrationSettings] = useState({
    autoCurriculum: true,
    autoStudyPlan: true,
    autoAssignments: true,
    autoTargets: true,
    enableAI: true,
  });
  const [integrationPreview, setIntegrationPreview] = useState<IntegrationPreview | null>(null);

  // Load available courses
  const { data: availableCourses = [] } = useQuery<CourseOption[]>({
    queryKey: ['/api/forms/courses-available'],
  });

  // Load AI recommendations
  const { data: aiRecommendations = [] } = useQuery<AIRecommendation[]>({
    queryKey: ['/api/ai/recommendations', user?.id],
    enabled: !!user?.id,
  });

  // Calculate integration preview when courses change
  useEffect(() => {
    if (selectedCourses.length > 0) {
      const selected = (availableCourses as CourseOption[]).filter((c: CourseOption) => selectedCourses.includes(c.id));
      const totalDuration = selected.reduce((sum: number, c: CourseOption) => sum + (c.durationHours || 40), 0);
      const estimatedWeeks = Math.ceil(totalDuration / 10);
      const weeklyHours = Math.round(totalDuration / estimatedWeeks);

      setIntegrationPreview({
        curriculum: { newCourses: selected.length, totalWeeks: estimatedWeeks },
        studyPlan: { weeklyHours, totalHours: totalDuration },
        assignments: { totalAssignments: selected.length * 3, weeklyAssignments: selected.length },
      });
    } else {
      setIntegrationPreview(null);
    }
  }, [selectedCourses, availableCourses]);

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/integration/enroll-and-integrate', {
        courseIds: selectedCourses,
        settings: integrationSettings,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forms/courses-enrolled'] });
      setSelectedCourses([]);
      alert('✅ Courses enrolled! Integration started across all modules.');
    },
  });

  const toggleCourse = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🎓 Course Enrollment with AI Integration</h1>
        <p className="text-sm opacity-70 mt-2">
          Enroll in courses and see how they'll integrate across your learning ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {(availableCourses as CourseOption[]).map((course: CourseOption) => (
                <div
                  key={course.id}
                  className="p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => toggleCourse(course.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{course.titleEn}</div>
                      <div className="text-xs opacity-70 flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        {course.durationHours && (
                          <Badge variant="outline" className="text-xs">
                            {course.durationHours}h
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <strong>{selectedCourses.length}</strong> course(s) selected
            </div>
          </CardContent>
        </Card>

        {/* Integration Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Integration Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrationPreview ? (
              <>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs opacity-70">Curriculum</div>
                    <div className="text-lg font-bold">
                      +{integrationPreview.curriculum.newCourses} courses
                    </div>
                    <div className="text-xs opacity-70">
                      {integrationPreview.curriculum.totalWeeks} weeks
                    </div>
                  </div>

                  <div>
                    <div className="text-xs opacity-70">Study Time</div>
                    <div className="text-lg font-bold">
                      {integrationPreview.studyPlan.weeklyHours}h/week
                    </div>
                    <div className="text-xs opacity-70">
                      {integrationPreview.studyPlan.totalHours}h total
                    </div>
                  </div>

                  <div>
                    <div className="text-xs opacity-70">Assignments</div>
                    <div className="text-lg font-bold">
                      {integrationPreview.assignments.totalAssignments} total
                    </div>
                    <div className="text-xs opacity-70">
                      {integrationPreview.assignments.weeklyAssignments}/week
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
                  All modules ready for integration
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-sm opacity-70">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Select courses to see integration impact
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {(aiRecommendations as AIRecommendation[]).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(aiRecommendations as AIRecommendation[]).slice(0, 3).map((rec: AIRecommendation, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">{rec.title}</div>
                    <Badge className="bg-blue-100 text-blue-800">{rec.confidence}%</Badge>
                  </div>
                  <p className="text-xs opacity-70 mb-2">{rec.description}</p>
                  <p className="text-xs text-blue-600">{rec.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Integration Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { key: 'autoCurriculum', label: '📚 Auto Curriculum' },
              { key: 'autoStudyPlan', label: '📅 Auto Study Plan' },
              { key: 'autoAssignments', label: '📝 Auto Assignments' },
              { key: 'autoTargets', label: '🎯 Auto Targets' },
              { key: 'enableAI', label: '🤖 Enable AI' },
            ].map((setting) => (
              <label
                key={setting.key}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-secondary/30 cursor-pointer"
              >
                <Checkbox
                  checked={integrationSettings[setting.key as keyof typeof integrationSettings]}
                  onCheckedChange={(checked) =>
                    setIntegrationSettings((prev) => ({
                      ...prev,
                      [setting.key]: checked,
                    }))
                  }
                />
                <span className="text-sm font-medium">{setting.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={() => enrollMutation.mutate()}
          disabled={selectedCourses.length === 0 || enrollMutation.isPending}
          className="flex-1 gap-2"
        >
          <BookOpen className="w-5 h-5" />
          {enrollMutation.isPending ? 'Enrolling...' : `🚀 Enroll & Integrate (${selectedCourses.length})`}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => setSelectedCourses([])}
          className="gap-2"
        >
          Clear Selection
        </Button>
      </div>

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-blue-900">How Integration Works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-xs">
              <li>Curriculum Generator: Creates AI-powered personalized curriculum</li>
              <li>Study Planner: Auto-generates study schedules and sessions</li>
              <li>Assignment Creator: Generates diverse assignments with smart due dates</li>
              <li>AI Subcourse Director: Breaks courses into progressive learning modules</li>
              <li>All modules sync in real-time and track success metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
