import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, BookOpen, Target, Zap, CheckCircle2, AlertCircle, 
  Clock, Award, BarChart3, Brain, Lightbulb, ArrowRight 
} from 'lucide-react';

export default function StudentCurriculumDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch curriculum list
  const { data: curriculumList = [] } = useQuery<any[]>({
    queryKey: ['/api/curriculum/list'],
    enabled: !!user
  });

  // Fetch production history
  const { data: productionHistory = [] } = useQuery<any[]>({
    queryKey: ['/api/production/list'],
    enabled: !!user
  });

  // Get current curriculum (latest one)
  const currentCurriculum = curriculumList[0];
  const currentProduction = productionHistory[0];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold">My Curriculum</h1>
            </div>
            <Button variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Generate New
            </Button>
          </div>
          <p className="text-gray-600">Track your AI-personalized learning journey</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Curriculum Card */}
              <div className="lg:col-span-2">
                <Card className="p-6 h-full">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Current Curriculum
                  </h2>
                  
                  {currentCurriculum ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {currentCurriculum.title || 'Personalized Learning Path'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {currentCurriculum.description || 'Your AI-generated curriculum tailored to your goals'}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {currentCurriculum.courses?.length || 0}
                          </div>
                          <div className="text-xs text-gray-600">Courses</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {currentCurriculum.estimatedDuration || 0}h
                          </div>
                          <div className="text-xs text-gray-600">Duration</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round((currentCurriculum.aiConfidence || 0.8) * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">AI Confidence</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <div className="font-medium text-sm">Learning Path</div>
                        <div className="space-y-2">
                          {currentCurriculum.courses?.slice(0, 3).map((course: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{course.titleEn || course.title}</div>
                                <div className="text-xs text-gray-500">{course.level} • {course.durationHours}h</div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                          {(currentCurriculum.courses?.length || 0) > 3 && (
                            <div className="text-sm text-blue-600 font-medium">
                              +{currentCurriculum.courses.length - 3} more courses
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button className="flex-1" variant="default">
                          Continue Learning
                        </Button>
                        <Button className="flex-1" variant="outline">
                          Customize
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">No curriculum generated yet</p>
                      <Button className="gap-2">
                        <Zap className="w-4 h-4" />
                        Generate Your First Curriculum
                      </Button>
                    </div>
                  )}
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>This Week</span>
                        <span className="font-semibold">12h</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      3 Courses Started
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      1 Course Completed
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <AlertCircle className="w-4 h-4" />
                      2 More to unlock
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Learning Progress
              </h2>
              
              <div className="space-y-6">
                {currentCurriculum?.courses?.map((course: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.titleEn || course.title}</h3>
                        <p className="text-sm text-gray-600">{course.level}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{Math.random() * 100 | 0}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    <Progress value={Math.random() * 100 | 0} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI Suggestions
                </h2>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-sm">Course Recommendations</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on your progress, we recommend focusing on Advanced Mathematics next
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-sm">Optimization Suggestion</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Increase study time to 25h/week for faster completion
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="font-medium text-sm">Learning Strategy</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Try the Pomodoro technique for better focus and retention
                    </p>
                  </div>
                </div>
              </Card>

              {/* Performance Insights */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Probability</span>
                      <span className="font-semibold text-green-600">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engagement Score</span>
                      <span className="font-semibold text-blue-600">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Consistency</span>
                      <span className="font-semibold text-purple-600">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Production History
              </h2>
              
              {productionHistory.length > 0 ? (
                <div className="space-y-4">
                  {productionHistory.slice(0, 5).map((prod: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{prod.selectedCurriculum?.title || `Curriculum ${idx + 1}`}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {prod.aiConfidenceScore ? `${Math.round(prod.aiConfidenceScore * 100)}%` : 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {prod.selectedCurriculum?.courses?.length || 0} courses • {prod.selectedCurriculum?.estimatedDuration || 0}h duration
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(prod.createdAt).toLocaleDateString()}</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No curriculum history yet</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
